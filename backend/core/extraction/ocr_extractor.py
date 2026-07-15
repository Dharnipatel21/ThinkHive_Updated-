# backend/core/extraction/ocr_extractor.py
from core.extraction.pdf_extractor import ExtractionResult
from core.languages import OCR_LANGUAGE_STRING


async def extract_ocr(content: bytes, is_pdf: bool = True) -> ExtractionResult:
    try:
        import io
        import pytesseract
        pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        from pdf2image import convert_from_bytes
        from PIL import Image

        if is_pdf:
            images = convert_from_bytes(content, dpi=300, poppler_path=r"C:\Users\DARSHINI\Downloads\Release-26.02.0-0\poppler-26.02.0\Library\bin")
        else:
            images = [Image.open(io.BytesIO(content))]

        texts = []
        for img in images:
            t = pytesseract.image_to_string(img, lang=OCR_LANGUAGE_STRING)
            if t.strip():
                texts.append(t)
        return ExtractionResult(text="\n\n".join(texts), metadata={"ocr": True, "pages": len(images), "ocr_languages": OCR_LANGUAGE_STRING})
    except ImportError as e:
        return ExtractionResult(text="", metadata={"error": f"OCR dependency missing: {e}"})
    except Exception as e:
        return ExtractionResult(text="", metadata={"error": str(e)})