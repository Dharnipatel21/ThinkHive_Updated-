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
    import tempfile, os, asyncio
    from config import settings

    groq_key = settings.groq_api_key.get_secret_value() if settings.groq_api_key else None
    if not groq_key:
        return "", "GROQ_API_KEY not configured in .env"

    ext = "." + filename.rsplit(".", 1)[-1] if "." in filename else ".webm"
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        from groq import Groq
        client = Groq(api_key=groq_key)

        def _call():
            with open(tmp_path, "rb") as f:
                return client.audio.transcriptions.create(
                    file=(filename, f.read()),
                    model="whisper-large-v3-turbo",
                    response_format="text",
                )

        result = await asyncio.get_event_loop().run_in_executor(None, _call)
        text = result if isinstance(result, str) else getattr(result, "text", "")
        return text.strip(), None
    except Exception as e:
        print(f"Transcription error: {e}")
        return "", str(e)
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)