import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { addMember, getDomains } from "../../services/api";
import toast from "react-hot-toast";

const ROLES = ["employee", "manager", "guest"];

export default function AddMemberModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ email: "", full_name: "", role: "employee", domain_id: "" });
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDomains().then(setDomains).catch(() => setDomains([]));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.full_name) return;
    setLoading(true);
    try {
      await addMember({ ...form, domain_id: form.domain_id || null });
      toast.success(`${form.full_name} added successfully`);
      onSuccess?.();
      onClose();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to add member");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 px-4 backdrop-blur-sm">
      <div className="th-card w-full max-w-md p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">Add Member</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "full_name", label: "Full Name", placeholder: "Jane Smith" },
            { name: "email", label: "Work Email", placeholder: "jane@company.com", type: "email" },
          ].map(({ name, label, placeholder, type = "text" }) => (
            <div key={name}>
              <label className="mb-1 block text-sm text-foreground/70">{label}</label>
              <input type={type} value={form[name]} onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))} placeholder={placeholder} className="th-input" />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm text-foreground/70">Role</label>
            <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="th-input capitalize">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground/70">Domain</label>
            <select value={form.domain_id} onChange={(e) => setForm((p) => ({ ...p, domain_id: e.target.value }))} className="th-input">
              <option value="">No domain</option>
              {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">An email with a setup code will be sent to this address.</p>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="th-button-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading || !form.email || !form.full_name} className="th-button flex-1">
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
