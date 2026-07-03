import { create } from "zustand";
import toast from "react-hot-toast";
import { sendQuery } from "../services/api";
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : "Low";
export const useChatStore = create((set, get) => ({
  messages: [], isLoading: false,
  async send(query) {
    set({ messages: [...get().messages, { id: Date.now(), role: "user", content: query }], isLoading: true });
    try {
      const d = await sendQuery(query);
      set({ messages: [...get().messages, { id: Date.now()+1, role: "assistant", content: d.answer,
        meta: { confidence: { score: d.confidence, level: cap(d.confidence_label) }, sources: d.citations?.map(c => ({ doc_name: c.document_name, relevance_score: c.score, page: c.page_number })) || [], contradiction_detected: d.contradiction_flag } }], isLoading: false });
    } catch (e) { set({ isLoading: false }); toast.error(e?.response?.data?.detail || "Query failed"); }
  },
  clear() { set({ messages: [] }); },
}));
