import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Bot } from "lucide-react";
import MessageBubble from "./MessageBubble";
import VoiceRecorder from "./VoiceRecorder";
import { useChatStore } from "../../store/useChatStore";

const SUGGESTIONS = ["What is the leave policy?","Summarise vendor contracts","What are safety protocols?","Who are our key suppliers?"];

export default function ChatWindow() {
  const { messages, isLoading, send, clear } = useChatStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  async function handleSend() { const q = input.trim(); if (!q || isLoading) return; setInput(""); await send(q); }
  function handleKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4F8EF7]/20"><Bot size={16} className="text-[#4F8EF7]" /></div>
          <div><p className="text-sm font-semibold text-white">AI Assistant</p><p className="text-xs text-white/40">RAG-powered · cited answers</p></div>
        </div>
        {messages.length > 0 && (
          <button onClick={clear} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-white/40 hover:bg-white/5 hover:text-white/70 transition">
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4F8EF7]/10"><Bot size={30} className="text-[#4F8EF7]" /></div>
            <p className="text-lg font-semibold text-white">Ask your knowledge base</p>
            <p className="mt-1 text-sm text-white/40 mb-6">Upload documents first, then ask anything</p>
            <div className="grid gap-2 sm:grid-cols-2 max-w-lg w-full">
              {SUGGESTIONS.map(q => (
                <button key={q} onClick={() => send(q)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-sm text-white/60 hover:border-[#4F8EF7]/40 hover:text-white/80 transition">{q}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map(m => <MessageBubble key={m.id} message={m} />)}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C2540]"><Bot size={15} className="text-[#4F8EF7]" /></div>
            <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-[#131929] px-4 py-3">
              <div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="h-2 w-2 rounded-full bg-[#4F8EF7] animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-white/5 px-6 py-4">
        <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-[#131929] px-4 py-3">
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="Ask anything about your documents…" rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            style={{maxHeight:"120px"}} />
          <div className="flex items-center gap-2">
            <VoiceRecorder onTranscript={t => setInput(t)} />
            <button onClick={handleSend} disabled={!input.trim()||isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 disabled:opacity-40 transition">
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
        <p className="mt-1.5 text-center text-xs text-white/20">Enter to send · Shift+Enter for newline · 🎙 for voice</p>
      </div>
    </div>
  );
}
