import { useEffect } from "react";
import { FileText, Trash2, RefreshCw, Zap, Download } from "lucide-react";
import { useDocumentStore } from "../../store/useDocumentStore";

const TAG_COLORS = {
  new: "bg-secondary/35 text-secondary-foreground", recent: "bg-primary/15 text-primary",
  old: "bg-primary/15 text-primary", outdated: "bg-destructive/15 text-destructive",
  fresh: "bg-secondary/35 text-secondary-foreground", stale: "bg-primary/15 text-primary",
  expired: "bg-destructive/15 text-destructive", active: "bg-secondary/35 text-secondary-foreground",
  unused: "bg-muted text-muted-foreground",
  public: "bg-secondary/35 text-secondary-foreground", internal: "bg-primary/15 text-primary",
  restricted: "bg-primary/15 text-primary", confidential: "bg-destructive/15 text-destructive",
};

function Tag({ label }) {
  if (!label) return null;
  return <span className={`rounded px-2 py-0.5 text-xs font-medium ${TAG_COLORS[label] || "bg-muted text-muted-foreground"}`}>{label}</span>;
}

export default function DocumentList({ view = "list" }) {
  const { documents, isLoading, fetch, remove } = useDocumentStore();
  useEffect(() => { fetch(); }, []);

  if (isLoading) return <div className="flex items-center justify-center py-12 text-muted-foreground"><RefreshCw size={20} className="animate-spin mr-2" /> Loading...</div>;
  if (!documents.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileText size={40} className="mb-3 text-muted-foreground/40" />
      <p className="text-muted-foreground">No documents yet. Upload your first document above.</p>
    </div>
  );

  if (view === "grid") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {documents.map((doc) => (
          <div key={doc.id} className="th-card group p-5">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <FileText size={21} />
            </div>
            <h3 className="truncate font-semibold text-foreground">{doc.filename}</h3>
            <p className="mt-2 font-mono text-sm text-muted-foreground">{doc.classification || "PDF"} · {doc.status || "ready"}</p>
            <div className="mt-4 flex flex-wrap gap-1">
              <Tag label={doc.age_tag} />
              <Tag label={doc.freshness_tag} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{documents.length} document{documents.length !== 1 ? "s" : ""}</p>
        <button onClick={fetch} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><RefreshCw size={12} /> Refresh</button>
      </div>
      {documents.map(doc => (
        <div key={doc.id} className="group flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0 hover:bg-muted/25">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <FileText size={17} className="text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-semibold text-foreground">{doc.filename}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Tag label={doc.classification} />
              <Tag label={doc.age_tag} />
              <Tag label={doc.freshness_tag} />
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${doc.status === "ready" ? "bg-secondary/35 text-secondary-foreground" : "bg-primary/15 text-primary"}`}>
                {doc.status}
              </span>
            </div>
          </div>
          <div className="hidden items-center gap-1.5 font-mono text-sm text-muted-foreground sm:flex">
            <Zap size={11} /> {Math.round(doc.document_weight * 100)}%
          </div>
          <button className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition">
            <Download size={14} />
          </button>
          <button onClick={() => remove(doc.id)} className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
