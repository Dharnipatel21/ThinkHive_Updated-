import { Brain, User } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";
import SourceCitation from "./SourceCitation";
import TypewriterText from "./TypewriterText";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isUser ? "bg-primary" : "bg-muted"}`}>
        {isUser ? <User size={15} className="text-primary-foreground" /> : <Brain size={15} className="text-primary" />}
      </div>
      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm border border-border bg-card text-foreground/90"
          }`}
        >
          {isUser || !message.isNew ? message.content : <TypewriterText text={message.content} />}
        </div>
        {!isUser && message.meta && (
          <div className="px-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {message.meta.confidence && <ConfidenceBadge score={message.meta.confidence.score} level={message.meta.confidence.level} />}
              {message.meta.contradiction_detected && (
                <span className="rounded-full border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-xs text-destructive">⚠ Contradiction</span>
              )}
            </div>
            <SourceCitation sources={message.meta.sources} />
          </div>
        )}
      </div>
    </div>
  );
}