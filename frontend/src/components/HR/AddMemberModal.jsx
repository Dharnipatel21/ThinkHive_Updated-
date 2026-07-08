/*
import { useState } from "react";
import { X } from "lucide-react";
import { addMember } from "../../services/api";
import toast from "react-hot-toast";

const ROLES = ["employee","manager","guest"];

export default function AddMemberModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ email: "", full_name: "", role: "employee" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.full_name) return;
    setLoading(true);
    try {
      await addMember(form);
      toast.success(`${form.full_name} added successfully`);
      onSuccess?.();
      onClose();
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed to add member"); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1C2540] bg-[#131929] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Add Member</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/40 hover:bg-white/5"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{name:"full_name",label:"Full Name",placeholder:"Jane Smith"},{name:"email",label:"Work Email",placeholder:"jane@company.com",type:"email"}].map(({name,label,placeholder,type="text"})=>(
            <div key={name}>
              <label className="mb-1 block text-sm text-white/70">{label}</label>
              <input type={type} value={form[name]} onChange={e=>setForm(p=>({...p,[name]:e.target.value}))} placeholder={placeholder}
                className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#4F8EF7] focus:outline-none" />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm text-white/70">Role</label>
            <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}
              className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white capitalize focus:border-[#4F8EF7] focus:outline-none">
              {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <p className="text-xs text-white/30">Default password: TempPass@123 — member must reset on first login</p>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={loading||!form.email||!form.full_name}
              className="flex-1 rounded-lg bg-[#4F8EF7] py-2.5 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 disabled:opacity-50">
              {loading?"Adding...":"Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
*/
/*
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { addMember, getDomains } from "../../services/api";
import toast from "react-hot-toast";

const ROLES = ["employee","manager","guest"];

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
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed to add member"); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1C2540] bg-[#131929] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Add Member</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/40 hover:bg-white/5"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{name:"full_name",label:"Full Name",placeholder:"Jane Smith"},{name:"email",label:"Work Email",placeholder:"jane@company.com",type:"email"}].map(({name,label,placeholder,type="text"})=>(
            <div key={name}>
              <label className="mb-1 block text-sm text-white/70">{label}</label>
              <input type={type} value={form[name]} onChange={e=>setForm(p=>({...p,[name]:e.target.value}))} placeholder={placeholder}
                className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#4F8EF7] focus:outline-none" />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm text-white/70">Role</label>
            <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}
              className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white capitalize focus:border-[#4F8EF7] focus:outline-none">
              {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/70">Domain</label>
            <select value={form.domain_id} onChange={e=>setForm(p=>({...p,domain_id:e.target.value}))}
              className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white focus:border-[#4F8EF7] focus:outline-none">
              <option value="">No domain</option>
              {domains.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <p className="text-xs text-white/30">Default password: TempPass@123 — member must reset on first login</p>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={loading||!form.email||!form.full_name}
              className="flex-1 rounded-lg bg-[#4F8EF7] py-2.5 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 disabled:opacity-50">
              {loading?"Adding...":"Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

*/
/*
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { addMember, getDomains } from "../../services/api";
import toast from "react-hot-toast";

const ROLES = ["employee","manager","guest"];

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
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed to add member"); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1C2540] bg-[#131929] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Add Member</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/40 hover:bg-white/5"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{name:"full_name",label:"Full Name",placeholder:"Jane Smith"},{name:"email",label:"Work Email",placeholder:"jane@company.com",type:"email"}].map(({name,label,placeholder,type="text"})=>(
            <div key={name}>
              <label className="mb-1 block text-sm text-white/70">{label}</label>
              <input type={type} value={form[name]} onChange={e=>setForm(p=>({...p,[name]:e.target.value}))} placeholder={placeholder}
                className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#4F8EF7] focus:outline-none" />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm text-white/70">Role</label>
            <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}
              className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white capitalize focus:border-[#4F8EF7] focus:outline-none">
              {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/70">Domain</label>
            <select value={form.domain_id} onChange={e=>setForm(p=>({...p,domain_id:e.target.value}))}
              className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white focus:border-[#4F8EF7] focus:outline-none">
              <option value="">No domain</option>
              {domains.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <p className="text-xs text-white/30">An email with a setup code will be sent to this address</p>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white/60 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={loading||!form.email||!form.full_name}
              className="flex-1 rounded-lg bg-[#4F8EF7] py-2.5 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 disabled:opacity-50">
              {loading?"Adding...":"Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
*/
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
    } catch (e) { toast.error(e?.response?.data?.detail || "Failed to add member"); }
    setLoading(false);
  }

  const inputClass = "w-full rounded-lg border border-border bg-base px-4 py-2.5 text-cream placeholder:text-rose-muted/50 focus:border-gold focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-cream">Add Member</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-rose-muted hover:bg-white/5 hover:text-cream transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ name: "full_name", label: "Full Name", placeholder: "Jane Smith" }, { name: "email", label: "Work Email", placeholder: "jane@company.com", type: "email" }].map(({ name, label, placeholder, type = "text" }) => (
            <div key={name}>
              <label className="mb-1 block text-sm text-rose-muted">{label}</label>
              <input
                type={type}
                value={form[name]}
                onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm text-rose-muted">Role</label>
            <select
              value={form.role}
              onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className={`${inputClass} capitalize`}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-rose-muted">Domain</label>
            <select
              value={form.domain_id}
              onChange={e => setForm(p => ({ ...p, domain_id: e.target.value }))}
              className={inputClass}
            >
              <option value="">No domain</option>
              {domains.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <p className="text-xs text-rose-muted/60">An email with a setup code will be sent to this address</p>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border py-2.5 text-sm text-rose-muted hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.email || !form.full_name}
              className="flex-1 rounded-lg bg-gold py-2.5 text-sm font-semibold text-base-deep hover:bg-gold-light disabled:opacity-50 transition-colors"
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}