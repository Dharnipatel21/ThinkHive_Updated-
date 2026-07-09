import { useState } from "react";
import { Search, FileText, Loader2 } from "lucide-react";
import { semanticSearch } from "../services/api";
import VoiceRecorder from "../components/Chat/VoiceRecorder";
import toast from "react-hot-toast";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(q) {
    const text = q || query;
    if (!text.trim()) return;
    setLoading(true); setSearched(true);
    try { const r = await semanticSearch(text.trim()); setResults(r.results || []); }
    catch { toast.error("Search failed"); }
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Semantic Search</h1>
        <p className="mt-1 text-muted-foreground">Search across your entire knowledge base by meaning, not keywords</p>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <Search size={18} className="text-muted-foreground flex-shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search your knowledge base…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <VoiceRecorder onTranscript={t => { setQuery(t); handleSearch(t); }} />
        </div>
        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className="rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 transition"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
        </button>
      </div>
      {searched && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              No results. Try a different search term or upload more documents.
            </div>
          ) : results.map((r, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <FileText size={15} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">{r.document_name}</span>
                  <span className="text-xs text-muted-foreground">p.{r.page_number}</span>
                </div>
                <span className="text-xs font-medium text-primary">{Math.round(r.score * 100)}%</span>
              </div>
              <p className="mt-2 text-sm text-foreground/70 line-clamp-3">{r.text}</p>
            </div>
          ))}
        </div>
      )}
      {!searched && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Search size={32} className="mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">Enter a search query or use voice search</p>
        </div>
      )}
    </div>
  );
}