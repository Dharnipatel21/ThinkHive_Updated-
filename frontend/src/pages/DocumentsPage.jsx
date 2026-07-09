import { useState } from "react";
import { Grid2X2, List, Upload } from "lucide-react";
import UploadPanel from "../components/Upload/UploadPanel";
import DocumentList from "../components/Upload/DocumentList";

export default function DocumentsPage() {
  const [view, setView] = useState("grid");
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="th-page space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Documents</h1>
          <p className="mt-1 text-muted-foreground">1,284 files across 28 folders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-card p-1">
            <button
              onClick={() => setView("grid")}
              className={`rounded-lg p-2.5 ${view === "grid" ? "bg-primary/14 text-foreground" : "text-muted-foreground"}`}
              aria-label="Grid view"
            >
              <Grid2X2 size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-lg p-2.5 ${view === "list" ? "bg-primary/14 text-foreground" : "text-muted-foreground"}`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
          <button onClick={() => setShowUpload((v) => !v)} className="th-button">
            <Upload size={17} /> Upload
          </button>
        </div>
      </div>

      {showUpload && (
        <section className="th-card p-6">
          <h2 className="font-display mb-4 text-xl">Upload Documents</h2>
          <UploadPanel />
        </section>
      )}

      <section className={view === "list" ? "th-card overflow-hidden" : ""}>
        <DocumentList view={view} />
      </section>
    </div>
  );
}
