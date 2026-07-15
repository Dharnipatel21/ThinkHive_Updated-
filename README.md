<div align="center">

#  ThinkHive

### Stop searching. Start asking.
**Your organization's brain, on demand.**

A multilingual, multi-tenant enterprise knowledge management platform powered by Retrieval-Augmented Generation (RAG) — unifying governed document knowledge bases, conversational AI search, HR & onboarding management, and role-based access control into a single product.

[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20DB-DC244C?style=for-the-badge&logo=qdrant&logoColor=white)](https://qdrant.tech/)
[![Groq](https://img.shields.io/badge/Groq-LLM%20%2B%20Whisper-F55036?style=for-the-badge&logoColor=white)](https://console.groq.com/)
[![License](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](#-license)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [First-Time Setup Walkthrough](#-first-time-setup-walkthrough)
- [Access Control Model](#-access-control-model)
- [CSV Format for Bulk Member Upload](#-csv-format-for-bulk-member-upload)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About

**ThinkHive** turns your organization's scattered documents, recordings, and institutional knowledge into a single conversational interface. Instead of digging through folders and drives, employees simply *ask* — and get grounded, cited, multilingual answers backed by your own governed content.

Built for real enterprise constraints: tiered document access, per-domain isolation, audit trails, and role-based permissions — not just a chatbot bolted onto a vector store.

---

## ✨ Features

### 🔐 Identity & Access
| Feature | Status |
|---|:---:|
| Company registration with OTP verification | ✅ |
| Org-slug based login | ✅ |
| Role-Based Access Control (RBAC) with permissions matrix | ✅ |
| Three-tier document access — Public / Internal / Confidential | ✅ |
| Domain-based content isolation | ✅ |
| Audit trail | ✅ |

### 📚 Knowledge Ingestion
| Feature | Status |
|---|:---:|
| Document upload (PDF, DOCX, TXT) | ✅ |
| Audio upload (MP3, WAV, M4A, OGG, FLAC) w/ Whisper transcription | ✅ |
| YouTube link ingestion (captions or audio fallback) | ✅ |
| OCR for scanned PDFs & images (Tesseract) | ✅ |
| PII sanitisation | ✅ |
| Salary detection | ✅ |
| Document tagging (age / freshness / usage) | ✅ |

### 🤖 Conversational AI
| Feature | Status |
|---|:---:|
| RAG-powered chat | ✅ |
| Voice query with semantic search | ✅ |
| Confidence scoring | ✅ |
| Contradiction detection | ✅ |
| Knowledge gap detection | ✅ |
| Summarisation | ✅ |
| Per-user chat memory (MongoDB-persisted) | ✅ |
| ChatGPT-style conversation sidebar (5 threads/user) | ✅ |
| Markdown-rendered responses | ✅ |

### 🌍 Multilingual
| Feature | Status |
|---|:---:|
| English, Hindi, Tamil, Telugu, Marathi support | ✅ |
| Multilingual LLM responses | ✅ |
| Multilingual Whisper transcription | ✅ |
| Multilingual OCR | ✅ |

### 🏢 HR & Organization
| Feature | Status |
|---|:---:|
| HR bulk CSV upload | ✅ |
| Add members one by one | ✅ |
| Dashboard metrics | ✅ |
| Analytics (Org Super Admin only) | ✅ |
| Interactive canvas-based Knowledge Map | ✅ |
| Admin panel with live permission editing | ✅ |

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Backend**
- FastAPI (Python 3.11)
- MongoDB via Motor (async)
- Qdrant — vector database
- Groq API — LLM inference + Whisper transcription
- Tesseract OCR
- pydantic-settings

</td>
<td valign="top" width="50%">

**Frontend**
- React + Vite
- Tailwind CSS — custom maroon/gold/cream design system
- Zustand — state management
- react-markdown + remark-gfm
- react-hot-toast
- Playfair Display (headings) · Inter (body)

</td>
</tr>
</table>

**Infrastructure:** Native uvicorn backend · Dockerized Qdrant · Native MongoDB service

---

## 🏗 Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  React + Vite    │◄────►│   FastAPI Core    │◄────►│    MongoDB      │
│  Tailwind UI      │      │  (async / Motor)  │      │  (users, docs,  │
│  Zustand store     │      │                  │      │   chats, audit) │
└─────────────────┘      └────────┬─────────┘      └─────────────────┘
                                     │
                       ┌─────────────┼─────────────┐
                       ▼             ▼             ▼
                 ┌──────────┐  ┌──────────┐  ┌──────────────┐
                 │  Qdrant  │  │   Groq   │  │  Tesseract    │
                 │ (vectors)│  │ LLM +    │  │  OCR          │
                 │          │  │ Whisper  │  │               │
                 └──────────┘  └──────────┘  └──────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running on `localhost:27017`
- Qdrant running on `localhost:6333` *(optional — falls back to hash embeddings)*

### 1️⃣ Start MongoDB
```bash
# Mac
brew services start mongodb-community@7.0

# Windows — run as a service, then verify:
mongosh --eval "db.adminCommand('ping')"
```

### 2️⃣ Start Qdrant
```bash
docker run -p 6333:6333 qdrant/qdrant
# Skipping this is fine — chat still works via hash-embedding fallback
```

### 3️⃣ Backend Setup
```bash
cd backend

python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
python -m spacy download en_core_web_lg   # needed for PII detection

cp ../.env .env
# Add your API keys — see Environment Variables below

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Backend → `http://localhost:8000` · API docs → `http://localhost:8000/docs`

### 4️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend → `http://localhost:5173`

---

## 🔑 Environment Variables

At least one LLM key is required — without it, chat falls back to showing raw retrieved text.

| Variable | Required | Get it from |
|---|:---:|---|
| `GROQ_API_KEY` | ✅ Recommended | [console.groq.com](https://console.groq.com) |
| `GOOGLE_API_KEY` | Optional | [aistudio.google.com](https://aistudio.google.com) |

---

## 🧭 First-Time Setup Walkthrough

1. Open `http://localhost:5173`
2. Click **Register Company**
3. Enter company name, slug (e.g. `my-company`), and work email
4. Enter the OTP shown in the backend terminal — `[DEV OTP] your@email.com: 123456`
5. Set your full name and password → you're now logged in as **Super Admin**
6. **Domains** → create your first domain (e.g. HR, Finance, IT)
7. **Documents** → upload a PDF or DOCX
8. Wait for status to flip to `ready` (typically 5–30s)
9. **AI Assistant** → ask a question about what you just uploaded 🎉

---

## 🔒 Access Control Model

ThinkHive enforces a **locked, three-tier document access model**:

| Tier | Visibility |
|---|---|
| 🟢 **Public** | All organization members |
| 🟡 **Internal** | Same-domain users only (`domain_id` auto-assigned from uploader, embedded in JWT) |
| 🔴 **Confidential** | Uploader only |

**Org Super Admins** bypass all filters.

---

## 📋 CSV Format for Bulk Member Upload

```csv
email,full_name,role
jane@company.com,Jane Smith,employee
john@company.com,John Doe,manager
alice@company.com,Alice Brown,guest
```

---

## 🩺 Troubleshooting

<details>
<summary><b>Chat returns no results</b></summary>

Upload documents first, then ask questions. Check Qdrant is running:
```bash
curl http://localhost:6333/health
```
</details>

<details>
<summary><b>Login fails</b></summary>

Use the exact `organization_slug` you registered with — it's case-sensitive and lowercase only.
</details>

<details>
<summary><b>Upload fails with 415 error</b></summary>

Only PDF, DOCX, TXT, PNG, JPG, and MP3/WAV/M4A/OGG/FLAC/WEBM audio are supported.
</details>

<details>
<summary><b>OTP not received</b></summary>

In development mode, OTP is printed in the backend terminal — look for `[DEV OTP] your@email.com: 123456`.
</details>

<details>
<summary><b>Voice not working</b></summary>

```bash
pip install openai-whisper
# Mac
brew install ffmpeg
# Windows — download from ffmpeg.org
```
Also allow microphone access in your browser.
</details>

<details>
<summary><b>Audio upload or YouTube ingestion fails</b></summary>

Requires `GROQ_API_KEY` in `.env`. YouTube links without captions fall back to downloading + transcribing audio, which needs `ffmpeg` on the server. Very long recordings may exceed Groq's per-file size limit — trim and re-upload.
</details>

<details>
<summary><b>Sentence-transformers model download is slow</b></summary>

First run downloads the ~2.2GB `multilingual-e5-large` model; subsequent runs use the cache. Without it, a less-accurate hash-based fallback is used.
</details>

---

## 🗺 Roadmap

- [ ] Landing page refinements — hexagonal gold/maroon gem logo with subtle motion effects
- [ ] Re-index existing documents missing `domain_id` in Qdrant (post domain-access migration)

---

## 🤝 Contributing

This is currently a solo-maintained project. Issues and PRs are welcome — please open an issue first to discuss significant changes.

## 📄 License

MIT © ThinkHive

---

<div align="center">

**Built with ☕ and a lot of debugging.**

[GitHub](https://github.com/Darshini240906/thinkhive-updated)

</div>
