/*import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { bulkUploadCSV } from "../../services/api";
import toast from "react-hot-toast";

export default function BulkUploadCSV({ onSuccess }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const r = await bulkUploadCSV(file);
      setResult(r);
      toast.success(`${r.created} member(s) added`);
      onSuccess?.();
    } catch (e) { toast.error(e?.response?.data?.detail || "Upload failed"); }
    setLoading(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-[#131929] p-5">
        <div className="flex items-center gap-3 mb-3">
          <FileSpreadsheet size={20} className="text-[#4F8EF7]" />
          <div>
            <p className="text-sm font-semibold text-white">Bulk Upload via CSV</p>
            <p className="text-xs text-white/40">Upload multiple members at once</p>
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-white/10 bg-[#0B0F1A] p-4 mb-3">
          <p className="text-xs text-white/50 font-medium mb-1">Required CSV columns:</p>
          <code className="text-xs text-[#4F8EF7]">email, full_name, role</code>
          <p className="text-xs text-white/30 mt-1">role options: employee, manager, guest</p>
        </div>
        <input ref={inputRef} type="file" accept=".csv,.xlsx" onChange={handleFile} className="hidden" />
        <button onClick={() => inputRef.current?.click()} disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[#4F8EF7] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 disabled:opacity-50 transition">
          <Upload size={15} /> {loading ? "Uploading..." : "Select CSV File"}
        </button>
      </div>
      {result && (
        <div className="rounded-xl border border-white/10 bg-[#131929] p-4 space-y-2">
          <p className="text-sm font-semibold text-white">Upload Result</p>
          <div className="grid grid-cols-3 gap-3">
            {[{label:"Total",val:result.total,color:"text-white"},{label:"Created",val:result.created,color:"text-emerald-400"},{label:"Skipped",val:result.skipped,color:"text-amber-400"}].map(({label,val,color})=>(
              <div key={label} className="rounded-lg bg-[#0B0F1A] p-3 text-center">
                <p className={`text-xl font-bold ${color}`}>{val}</p>
                <p className="text-xs text-white/40">{label}</p>
              </div>
            ))}
          </div>
          {result.errors?.length > 0 && (
            <div className="mt-2 rounded-lg bg-red-500/10 p-3">
              <p className="text-xs font-medium text-red-400 mb-1">Errors:</p>
              {result.errors.slice(0,5).map((e,i) => <p key={i} className="text-xs text-red-400/80">{e}</p>)}
              {result.errors.length > 5 && <p className="text-xs text-red-400/60">+{result.errors.length-5} more</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
*/
import { useRef, useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { bulkUploadCSV } from "../../services/api";
import toast from "react-hot-toast";

export default function BulkUploadCSV({ onSuccess }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const r = await bulkUploadCSV(file);
      setResult(r);
      toast.success(`${r.created} member(s) added`);
      onSuccess?.();
    } catch (e) { toast.error(e?.response?.data?.detail || "Upload failed"); }
    setLoading(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-base p-5">
        <div className="flex items-center gap-3 mb-3">
          <FileSpreadsheet size={20} className="text-gold" />
          <div>
            <p className="text-sm font-semibold text-cream">Bulk Upload via CSV</p>
            <p className="text-xs text-rose-muted">Upload multiple members at once</p>
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-border bg-surface p-4 mb-3">
          <p className="text-xs text-rose-muted font-medium mb-1">Required CSV columns:</p>
          <code className="text-xs text-gold">email, full_name, role</code>
          <p className="text-xs text-rose-muted/60 mt-1">role options: employee, manager, guest</p>
        </div>
        <input ref={inputRef} type="file" accept=".csv,.xlsx" onChange={handleFile} className="hidden" />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-base-deep hover:bg-gold-light disabled:opacity-50 transition-colors"
        >
          <Upload size={15} /> {loading ? "Uploading..." : "Select CSV File"}
        </button>
      </div>

      {result && (
        <div className="rounded-xl border border-border bg-base p-4 space-y-2 animate-fade-in">
          <p className="text-sm font-semibold text-cream">Upload Result</p>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Total", val: result.total, color: "text-cream" }, { label: "Created", val: result.created, color: "text-success" }, { label: "Skipped", val: result.skipped, color: "text-warn" }].map(({ label, val, color }) => (
              <div key={label} className="rounded-lg bg-surface p-3 text-center">
                <p className={`font-display text-xl font-bold ${color}`}>{val}</p>
                <p className="text-xs text-rose-muted">{label}</p>
              </div>
            ))}
          </div>
          {result.errors?.length > 0 && (
            <div className="mt-2 rounded-lg bg-danger/10 p-3">
              <p className="text-xs font-medium text-danger mb-1">Errors:</p>
              {result.errors.slice(0, 5).map((e, i) => <p key={i} className="text-xs text-danger/80">{e}</p>)}
              {result.errors.length > 5 && <p className="text-xs text-danger/60">+{result.errors.length - 5} more</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}