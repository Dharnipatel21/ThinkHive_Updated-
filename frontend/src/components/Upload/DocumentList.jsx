import { useEffect } from "react";
import { FileText, Trash2, RefreshCw, Shield, Clock, Zap } from "lucide-react";
import { useDocumentStore } from "../../store/useDocumentStore";

const TAG_COLORS = {
  new: "bg-emerald-500/20 text-emerald-400", recent: "bg-blue-500/20 text-blue-400",
  old: "bg-amber-500/20 text-amber-400", outdated: "bg-red-500/20 text-red-400",
  fresh: "bg-emerald-500/20 text-emerald-400", stale: "bg-amber-500/20 text-amber-400",
  expired: "bg-red-500/20 text-red-400", active: "bg-blue-500/20 text-blue-400",
  unused: "bg-gray-500/20 text-gray-400",
  public: "bg-green-500/20 text-green-400", internal: "bg-blue-500/20 text-blue-400",
  restricted: "bg-amber-500/20 text-amber-400", confidential: "bg-red-500/20 text-red-400",
};

function Tag({ label }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TAG_COLORS[label] || "bg-white/10 text-white/50"}`}>{label}</span>;
}

export default function DocumentList() {
  const { documents, isLoading, fetch, remove } = useDocumentStore();
  useEffect(() => { fetch(); }, []);

  if (isLoading) return <div className="flex items-center justify-center py-12 text-white/40"><RefreshCw size={20} className="animate-spin mr-2" /> Loading...</div>;
  if (!documents.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileText size={40} className="mb-3 text-white/20" />
      <p className="text-white/50">No documents yet. Upload your first document above.</p>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-white/50">{documents.length} document{documents.length !== 1 ? "s" : ""}</p>
        <button onClick={fetch} className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60"><RefreshCw size={12} /> Refresh</button>
      </div>
      {documents.map(doc => (
        <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#131929] px-4 py-3 hover:border-white/20 transition group">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#4F8EF7]/10">
            <FileText size={17} className="text-[#4F8EF7]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">{doc.filename}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Tag label={doc.classification} />
              <Tag label={doc.age_tag} />
              <Tag label={doc.freshness_tag} />
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${doc.status === "ready" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                {doc.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Zap size={11} /> {Math.round(doc.document_weight * 100)}%
          </div>
          <button onClick={() => remove(doc.id)} className="flex-shrink-0 rounded-lg p-1.5 text-white/20 hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
