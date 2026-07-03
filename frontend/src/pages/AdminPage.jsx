import { useEffect, useState } from "react";
import { Shield, Users, Download, RefreshCw, Trash2, Edit, Loader2 } from "lucide-react";
import { getAuditTrail, getUsers, deleteUser } from "../services/api";
import toast from "react-hot-toast";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [audit, setAudit] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [u, a] = await Promise.all([getUsers(), getAuditTrail()]);
      setUsers(u.users||[]); setAudit(a.logs||[]);
    } catch {} setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    try { await deleteUser(id); setUsers(u => u.filter(x => x.id !== id)); toast.success("User deleted"); }
    catch { toast.error("Delete failed"); }
  }

  const CONF_COLORS = { high:"text-emerald-400", medium:"text-amber-400", low:"text-red-400" };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Admin Panel</h1><p className="mt-1 text-white/50">Manage users and view audit trail</p></div>
        <button onClick={load} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/50 hover:bg-white/5 transition">
          <RefreshCw size={14} className={loading?"animate-spin":""}/> Refresh
        </button>
      </div>
      <div className="flex gap-1 rounded-xl border border-white/10 bg-[#131929] p-1 w-fit">
        {[{k:"users",label:`Users (${users.length})`},{k:"audit",label:`Audit Trail (${audit.length})`}].map(({k,label})=>(
          <button key={k} onClick={()=>setTab(k)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab===k?"bg-[#4F8EF7] text-white":"text-white/50 hover:text-white"}`}>{label}</button>
        ))}
      </div>

      {tab === "users" && (
        <div className="rounded-2xl border border-white/10 bg-[#131929] p-5">
          {loading ? <div className="flex items-center justify-center py-8 text-white/40"><Loader2 size={18} className="animate-spin mr-2"/>Loading...</div>
          : users.length === 0 ? <p className="text-sm text-white/40 py-6 text-center">No users found</p>
          : <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0B0F1A] px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4F8EF7]/20 flex-shrink-0">
                    <span className="text-sm font-semibold text-[#4F8EF7]">{(u.full_name||"?")[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{u.full_name}</p>
                    <p className="text-xs text-white/40">{u.email}</p>
                  </div>
                  <span className="text-xs text-white/50 capitalize">{u.role?.replace(/_/g," ")}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${u.is_active?"bg-emerald-500/20 text-emerald-400":"bg-red-500/20 text-red-400"}`}>{u.is_active?"Active":"Disabled"}</span>
                  <button onClick={() => handleDelete(u.id)} className="text-white/20 hover:text-red-400 transition p-1"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>}
        </div>
      )}

      {tab === "audit" && (
        <div className="rounded-2xl border border-white/10 bg-[#131929] p-5">
          {loading ? <div className="flex items-center justify-center py-8 text-white/40"><Loader2 size={18} className="animate-spin mr-2"/>Loading...</div>
          : audit.length === 0 ? <p className="text-sm text-white/40 py-6 text-center">No audit logs yet. Start querying your knowledge base.</p>
          : <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {audit.map((l,i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-[#0B0F1A] px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-white/80 flex-1">{l.query}</p>
                    <span className={`text-xs font-medium flex-shrink-0 ${CONF_COLORS[l.confidence_label]||"text-white/40"}`}>{l.confidence_label}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/40 line-clamp-2">{l.answer}</p>
                  <p className="mt-1 text-xs text-white/20">{l.created_at ? new Date(l.created_at).toLocaleString() : ""}</p>
                </div>
              ))}
            </div>}
        </div>
      )}
    </div>
  );
}
