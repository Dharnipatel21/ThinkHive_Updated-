import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useDocumentStore } from "../../store/useDocumentStore";

const CLASSIFICATIONS = ["public","internal","restricted","confidential"];

export default function UploadPanel() {
  const { upload } = useDocumentStore();
  const [files, setFiles] = useState([]);
  const [classification, setClassification] = useState("internal");
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(accepted => {
    setFiles(prev => [...prev, ...accepted.map(f => ({ file: f, status: "pending" }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "text/plain": [".txt"] },
    maxSize: 25 * 1024 * 1024,
  });

  async function handleUpload() {
    if (!files.filter(f => f.status === "pending").length) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") continue;
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "uploading" } : f));
      try {
        await upload(files[i].file, classification);
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "done" } : f));
      } catch {
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "error" } : f));
      }
    }
    setUploading(false);
  }

  const STATUS_ICON = {
    pending: <div className="h-4 w-4 rounded-full border-2 border-white/20" />,
    uploading: <Loader2 size={14} className="animate-spin text-[#4F8EF7]" />,
    done: <CheckCircle size={14} className="text-emerald-400" />,
    error: <X size={14} className="text-red-400" />,
  };

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition
        ${isDragActive ? "border-[#4F8EF7] bg-[#4F8EF7]/5" : "border-white/10 hover:border-[#4F8EF7]/40 hover:bg-white/2"}`}>
        <input {...getInputProps()} />
        <Upload size={32} className="mx-auto mb-3 text-white/30" />
        <p className="text-sm font-medium text-white/70">{isDragActive ? "Drop files here" : "Drag & drop files, or click to browse"}</p>
        <p className="mt-1 text-xs text-white/30">PDF, DOCX, TXT · Max 25MB each</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-white/60 whitespace-nowrap">Classification:</label>
        <select value={classification} onChange={e => setClassification(e.target.value)}
          className="flex-1 rounded-lg border border-[#1C2540] bg-[#131929] px-3 py-2 text-sm text-white focus:border-[#4F8EF7] focus:outline-none capitalize">
          {CLASSIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#131929] px-4 py-2.5">
              <FileText size={16} className="text-white/40 flex-shrink-0" />
              <span className="flex-1 truncate text-sm text-white/80">{f.file.name}</span>
              <span className="text-xs text-white/30">{(f.file.size/1024).toFixed(0)}KB</span>
              {STATUS_ICON[f.status]}
              {f.status === "pending" && (
                <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-white/30 hover:text-red-400">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button onClick={handleUpload} disabled={uploading || !files.some(f => f.status === "pending")}
            className="w-full rounded-xl bg-[#4F8EF7] py-3 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 disabled:opacity-40 transition">
            {uploading ? "Uploading & Indexing..." : `Upload ${files.filter(f=>f.status==="pending").length} file(s)`}
          </button>
        </div>
      )}
    </div>
  );
}
