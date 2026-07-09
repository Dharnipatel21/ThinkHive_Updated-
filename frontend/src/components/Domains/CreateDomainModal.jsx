import { useState } from "react";
import { X } from "lucide-react";
import { useDomainStore } from "../../store/useDomainStore";

export default function CreateDomainModal({ onClose }) {
  const { create, domainTypes } = useDomainStore();
  const [form, setForm] = useState({ name: "", domain_type: "custom", description: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try { await create(form); onClose(); }
    catch {} finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 px-4 backdrop-blur-sm">
      <div className="th-card w-full max-w-md p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">Create Domain</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-foreground/70">Domain Name</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Engineering Team" className="th-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground/70">Domain Type</label>
            <select value={form.domain_type} onChange={(e) => setForm((p) => ({ ...p, domain_type: e.target.value }))} className="th-input capitalize">
              {(domainTypes.length ? domainTypes : ["hr","finance","it","manufacturing","legal","sales","marketing","operations","custom"]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground/70">Description <span className="text-muted-foreground">(optional)</span></label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="What documents or knowledge does this domain cover?" rows={3} className="th-input resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="th-button-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading || !form.name.trim()} className="th-button flex-1">
              {loading ? "Creating..." : "Create Domain"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
