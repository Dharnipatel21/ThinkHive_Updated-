# ThinkHive — Enterprise GenAI Knowledge Platform

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (running on localhost:27017)
- Qdrant (running on localhost:6333) — optional but needed for vector search

---

### 1. Start MongoDB
```bash
# Mac
brew services start mongodb-community@7.0

# Windows — run MongoDB Compass or start as service
# Check it's running:
mongosh --eval "db.adminCommand('ping')"
```

### 2. Start Qdrant (optional but recommended)
```bash
docker run -p 6333:6333 qdrant/qdrant
# OR skip this — chat will still work using hash embeddings as fallback
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Download spacy model (needed for PII detection)
python -m spacy download en_core_web_lg

# Copy env file from root
cp ../.env .env

# Add your API keys to .env
# GROQ_API_KEY=your_key_from_console.groq.com
# GOOGLE_API_KEY=your_key_from_aistudio.google.com

# Start the backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Getting Your Free API Keys

### Groq (Free, Fast — Recommended)
1. Go to https://console.groq.com
2. Sign up for free
3. Create an API key
4. Add to .env: GROQ_API_KEY=your_key

### Google Gemini (Free)
1. Go to https://aistudio.google.com
2. Sign up for free
3. Create an API key
4. Add to .env: GOOGLE_API_KEY=your_key

> At least one LLM key is required for the chat to work.
> Without a key, the system shows raw retrieved text as the answer.

---

## First Time Setup (In Order)

1. Open http://localhost:5173
2. Click "Register Company"
3. Enter your company name, slug (e.g. "my-company"), and work email
4. Enter the OTP shown in the backend terminal (dev mode shows OTP in console)
5. Set your full name and password
6. You are now logged in as Super Admin
7. Go to Domains → Create your first domain (e.g. HR, Finance, IT)
8. Go to Documents → Upload a PDF or DOCX file
9. Wait for status to show "ready" (usually 5-30 seconds)
10. Go to AI Assistant → Ask a question about your uploaded document

---

## Features

| Feature | Status |
|---|---|
| Landing page | ✅ |
| Company registration with OTP | ✅ |
| Login with org slug | ✅ |
| Document upload (PDF, DOCX, TXT) | ✅ |
| OCR for scanned PDFs | ✅ (needs tesseract) |
| PII sanitisation | ✅ (needs presidio) |
| Salary detection | ✅ |
| RAG-powered chat | ✅ |
| Voice query | ✅ (needs whisper) |
| Semantic search with voice | ✅ |
| Confidence scoring | ✅ |
| Contradiction detection | ✅ |
| Domain management | ✅ |
| HR bulk CSV upload | ✅ |
| Add members one by one | ✅ |
| Dashboard metrics | ✅ |
| Knowledge gaps | ✅ |
| Audit trail | ✅ |
| Document tagging (age/freshness/usage) | ✅ |
| RBAC (roles and permissions) | ✅ |
| Multilingual support | ✅ (with sentence-transformers) |
| Summarisation | ✅ |

---

## CSV Format for Bulk Member Upload

```csv
email,full_name,role
jane@company.com,Jane Smith,employee
john@company.com,John Doe,manager
alice@company.com,Alice Brown,guest
```

---

## Troubleshooting

**Chat returns no results**
→ Upload documents first, then ask questions
→ Check Qdrant is running: curl http://localhost:6333/health

**Login fails**
→ Make sure you use the exact organization_slug you registered with
→ Slug is case-sensitive and lowercase only

**Upload fails with 415 error**
→ Only PDF, DOCX, and TXT files are supported

**OTP not received**
→ In development mode, OTP is printed in the backend terminal
→ Look for: [DEV OTP] your@email.com: 123456

**Voice not working**
→ Install whisper: pip install openai-whisper
→ Install ffmpeg: brew install ffmpeg (Mac) or download from ffmpeg.org (Windows)
→ Allow microphone access in your browser

**Sentence-transformers model download slow**
→ First run downloads ~2.2GB multilingual-e5-large model
→ Subsequent runs use cached model — much faster
→ Without it, a hash-based fallback is used (less accurate)
