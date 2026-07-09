from fastapi import APIRouter, Depends, File, UploadFile
from api.dependencies.check_permissions import require_permission
from core.context import TenantContext

router = APIRouter(prefix="/voice", tags=["voice"])

@router.post("/query")
async def voice_query(
    audio: UploadFile = File(...),
    context: TenantContext = Depends(require_permission("query:run")),
) -> dict:
    content = await audio.read()
    transcript, error = await _transcribe(content, audio.filename or "audio.webm")
    if error:
        return {"transcribed_text": "", "status": "error", "error": error, "filename": audio.filename}
    return {"transcribed_text": transcript, "status": "transcribed", "filename": audio.filename}

async def _transcribe(content: bytes, filename: str) -> tuple[str, str | None]:
    from config import settings
    import asyncio

    # 1. Try Groq Whisper API first if API key is configured
    groq_key = settings.groq_api_key.get_secret_value() if settings.groq_api_key else None
    if groq_key:
        try:
            import io
            from groq import Groq
            client = Groq(api_key=groq_key)
            audio_file = io.BytesIO(content)
            audio_file.name = filename or "audio.webm"
            
            result = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: client.audio.transcriptions.create(
                    file=audio_file,
                    model="whisper-large-v3"
                )
            )
            text = result.text.strip()
            if text:
                print(f"Transcription successful via Groq: {text}")
                return text, None
        except Exception as e:
            print(f"Groq transcription failed: {e}. Trying next method...")

    # 2. Try Google Gemini API if Google API key is configured
    google_key = settings.google_api_key.get_secret_value() if settings.google_api_key else None
    if google_key:
        try:
            import tempfile, os
            import google.generativeai as genai
            genai.configure(api_key=google_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            # Gemini file upload requires writing to a temp file on disk
            ext = "." + filename.rsplit(".", 1)[-1] if "." in filename else ".webm"
            with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
                tmp.write(content)
                tmp_path = tmp.name
            
            try:
                # Upload using genai file API
                uploaded_file = await asyncio.get_event_loop().run_in_executor(
                    None,
                    lambda: genai.upload_file(path=tmp_path)
                )
                response = await asyncio.get_event_loop().run_in_executor(
                    None,
                    lambda: model.generate_content([uploaded_file, "Transcribe this audio file exactly. Do not add any commentary or formatting or prefix/suffix. Just return the transcription."])
                )
                # Cleanup the uploaded file from Google's servers
                try:
                    await asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda: uploaded_file.delete()
                    )
                except Exception as del_err:
                    print(f"Gemini server-side file deletion error: {del_err}")
                
                text = response.text.strip()
                if text:
                    print(f"Transcription successful via Gemini: {text}")
                    return text, None
            finally:
                if os.path.exists(tmp_path):
                    os.unlink(tmp_path)
        except Exception as e:
            print(f"Gemini transcription failed: {e}. Trying next method...")

    # 3. Fallback to local Whisper
    try:
        import whisper, tempfile, os
        ext = "." + filename.rsplit(".", 1)[-1] if "." in filename else ".webm"
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp.write(content); tmp_path = tmp.name
        model = whisper.load_model("base")
        result = await asyncio.get_event_loop().run_in_executor(None, lambda: model.transcribe(tmp_path, fp16=False))
        os.unlink(tmp_path)
        text = result.get("text", "").strip()
        if text:
            print(f"Transcription successful via local Whisper: {text}")
            return text, None
    except ImportError:
        print("Local Whisper is not installed.")
    except Exception as e:
        print(f"Local Whisper transcription failed: {e}")
        
    return "", "All transcription methods failed or returned empty text."

