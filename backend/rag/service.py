'''
from __future__ import annotations
from core.context import TenantContext
from core.embeddings import EmbeddingService
from core.retrieval import QdrantRetrievalService, RetrievedChunk
from rag.models import Citation, QueryRequest, QueryResponse

SYSTEM_PROMPT = """You are ThinkHive, an enterprise knowledge assistant.
Rules:
1. Answer ONLY from the provided context passages
2. Cite sources as [DocumentName, Page X] after each claim
3. If the answer is not in the context say: "I could not find this in your knowledge base."
4. Never fabricate information. Be concise and professional."""


class LLMService:
    def __init__(self):
        self._groq = None
        self._gemini = None
        self._init()

    def _init(self):
        from config import settings
        groq_key = settings.groq_api_key.get_secret_value() if settings.groq_api_key else None
        if groq_key:
            try:
                from groq import Groq
                self._groq = Groq(api_key=groq_key)
            except Exception as e:
                print(f"Groq init: {e}")
        google_key = settings.google_api_key.get_secret_value() if settings.google_api_key else None
        if google_key and not self._groq:
            try:
                import google.generativeai as genai
                genai.configure(api_key=google_key)
                self._gemini = genai.GenerativeModel("gemini-1.5-flash")
            except Exception as e:
                print(f"Gemini init: {e}")

    async def generate(self, query: str, chunks: list[RetrievedChunk]) -> str:
        if not chunks:
            return "I could not find relevant information in your knowledge base. Please upload documents first."
        context = "\n\n---\n\n".join(
            f"[{c.metadata.get('document_name','Doc')}, Page {c.metadata.get('page_number',1)}]:\n{c.text}"
            for c in chunks[:5]
        )
        user_msg = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer with citations:"
        if self._groq:
            return await self._groq_gen(user_msg)
        if self._gemini:
            return await self._gemini_gen(user_msg)
        return f"*LLM not configured. Add GROQ_API_KEY or GOOGLE_API_KEY to .env*\n\nRelevant content found:\n\n{context[:600]}"

    async def _groq_gen(self, msg: str) -> str:
        import asyncio
        try:
            r = await asyncio.get_event_loop().run_in_executor(None, lambda: self._groq.chat.completions.create(
                model="llama3-70b-8192",
                messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": msg}],
                max_tokens=1000, temperature=0.1
            ))
            return r.choices[0].message.content
        except Exception as e:
            return f"LLM error: {e}"

    async def _gemini_gen(self, msg: str) -> str:
        import asyncio
        try:
            r = await asyncio.get_event_loop().run_in_executor(None, lambda: self._gemini.generate_content(f"{SYSTEM_PROMPT}\n\n{msg}"))
            return r.text
        except Exception as e:
            return f"LLM error: {e}"


_llm = None

def get_llm():
    global _llm
    if _llm is None:
        _llm = LLMService()
    return _llm


async def run_rag(context: TenantContext, request: QueryRequest) -> QueryResponse:
    embedder = EmbeddingService()
    retrieval = QdrantRetrievalService()
    llm = get_llm()

    vec = await embedder.embed_text(request.query)
    chunks = await retrieval.search(context, vec, limit=request.limit)

    # Confidence scoring
    if chunks:
        score = min(1.0, sum(c.final_score for c in chunks[:3]) / min(3, len(chunks)))
        label = "high" if score > 0.85 else "medium" if score >= 0.70 else "low"
    else:
        score, label = 0.0, "low"

    # Simple contradiction check
    contradiction = False
    if len(chunks) >= 2:
        texts = [c.text.lower() for c in chunks]
        for a, b in [("is required","is not required"),("must not","must"),("not allowed","allowed")]:
            if any(a in t for t in texts) and any(b in t for t in texts):
                contradiction = True
                break

    answer = await llm.generate(request.query, chunks)
    return QueryResponse(
        answer=answer, confidence=score, confidence_label=label,
        contradiction_flag=contradiction,
        citations=[Citation(
            document_id=c.document_id, chunk_id=c.chunk_id, score=c.final_score,
            document_name=c.metadata.get("document_name",""),
            page_number=c.metadata.get("page_number",1),
            text_snippet=c.text[:200]
        ) for c in chunks]
    )
'''


from __future__ import annotations
from core.context import TenantContext
from core.embeddings import EmbeddingService
from core.retrieval import QdrantRetrievalService, RetrievedChunk
from rag.models import Citation, QueryRequest, QueryResponse

SYSTEM_PROMPT = """You are ThinkHive, an enterprise knowledge assistant.
Rules:
1. Answer ONLY from the provided context passages
2. Cite sources as [DocumentName, Page X] after each claim
3. If the answer is not in the context say: "I could not find this in your knowledge base."
4. Never fabricate information. Be concise and professional."""


class LLMService:
    def __init__(self):
        self._groq = None
        self._gemini = None
        self._init()

    def _init(self):
        from config import settings
        groq_key = settings.groq_api_key.get_secret_value() if settings.groq_api_key else None
        if groq_key:
            try:
                from groq import Groq
                self._groq = Groq(api_key=groq_key)
            except Exception as e:
                print(f"Groq init: {e}")
        google_key = settings.google_api_key.get_secret_value() if settings.google_api_key else None
        if google_key and not self._groq:
            try:
                import google.generativeai as genai
                genai.configure(api_key=google_key)
                self._gemini = genai.GenerativeModel("gemini-1.5-flash")
            except Exception as e:
                print(f"Gemini init: {e}")

    async def generate(self, query: str, chunks: list[RetrievedChunk]) -> str:
        if not chunks:
            return "I could not find relevant information in your knowledge base. Please upload documents first."
        context = "\n\n---\n\n".join(
            f"[{c.metadata.get('document_name','Doc')}, Page {c.metadata.get('page_number',1)}]:\n{c.text}"
            for c in chunks[:5]
        )
        user_msg = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer with citations:"
        if self._groq:
            return await self._groq_gen(user_msg)
        if self._gemini:
            return await self._gemini_gen(user_msg)
        return f"*LLM not configured. Add GROQ_API_KEY or GOOGLE_API_KEY to .env*\n\nRelevant content found:\n\n{context[:600]}"

    async def _groq_gen(self, msg: str) -> str:
        import asyncio
        try:
            r = await asyncio.get_event_loop().run_in_executor(None, lambda: self._groq.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": msg}],
                max_tokens=1000, temperature=0.1
            ))
            return r.choices[0].message.content
        except Exception as e:
            return f"LLM error: {e}"

    async def _gemini_gen(self, msg: str) -> str:
        import asyncio
        try:
            r = await asyncio.get_event_loop().run_in_executor(None, lambda: self._gemini.generate_content(f"{SYSTEM_PROMPT}\n\n{msg}"))
            return r.text
        except Exception as e:
            return f"LLM error: {e}"


_llm = None

def get_llm():
    global _llm
    if _llm is None:
        _llm = LLMService()
    return _llm


async def run_rag(context: TenantContext, request: QueryRequest) -> QueryResponse:
    embedder = EmbeddingService()
    retrieval = QdrantRetrievalService()
    llm = get_llm()

    vec = await embedder.embed_text(request.query)
    chunks = await retrieval.search(context, vec, limit=request.limit)

    # Confidence scoring
    if chunks:
        score = min(1.0, sum(c.final_score for c in chunks[:3]) / min(3, len(chunks)))
        label = "high" if score > 0.85 else "medium" if score >= 0.70 else "low"
    else:
        score, label = 0.0, "low"

    # Simple contradiction check
    contradiction = False
    if len(chunks) >= 2:
        texts = [c.text.lower() for c in chunks]
        for a, b in [("is required","is not required"),("must not","must"),("not allowed","allowed")]:
            if any(a in t for t in texts) and any(b in t for t in texts):
                contradiction = True
                break

    answer = await llm.generate(request.query, chunks)
    return QueryResponse(
        answer=answer, confidence=score, confidence_label=label,
        contradiction_flag=contradiction,
        citations=[Citation(
            document_id=c.document_id, chunk_id=c.chunk_id, score=c.final_score,
            document_name=c.metadata.get("document_name",""),
            page_number=c.metadata.get("page_number",1),
            text_snippet=c.text[:200]
        ) for c in chunks]
    )