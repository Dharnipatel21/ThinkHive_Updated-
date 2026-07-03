import { Brain, User } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";
import SourceCitation from "./SourceCitation";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isUser ? "bg-[#4F8EF7]" : "bg-[#1C2540]"}`}>
        {isUser ? <User size={15} className="text-white" /> : <Brain size={15} className="text-[#4F8EF7]" />}
      </div>
      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
          ${isUser ? "rounded-tr-sm bg-[#4F8EF7] text-white" : "rounded-tl-sm border border-white/10 bg-[#131929] text-white/90"}`}>
          {message.content}
        </div>
        {!isUser && message.meta && (
          <div className="px-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {message.meta.confidence && <ConfidenceBadge score={message.meta.confidence.score} level={message.meta.confidence.level} />}
              {message.meta.contradiction_detected && (
                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-xs text-orange-400">⚠ Contradiction</span>
              )}
            </div>
            <SourceCitation sources={message.meta.sources} />
          </div>
        )}
      </div>
    </div>
  );
}
