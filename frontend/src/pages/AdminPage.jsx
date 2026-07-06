import { useEffect, useState } from "react";
import { RefreshCw, Trash2, Loader2 } from "lucide-react";
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
      setUsers(u.users || []); setAudit(a.logs || []);
    } catch {} setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    try { await deleteUser(id); setUsers(u => u.filter(x => x.id !== id)); toast.success("User deleted"); }
    catch { toast.error("Delete failed"); }
  }

  const CONF_COLORS = { high: "text-secondary-foreground", medium: "text-primary", low: "text-destructive" };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Admin Panel</h1>
          <p className="mt-1 text-muted-foreground">Manage users and view audit trail</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 w-fit">
        {[{ k: "users", label: `Users (${users.length})` }, { k: "audit", label: `Audit Trail (${audit.length})` }].map(({ k, label }) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="rounded-2xl border border-border bg-card p-5">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 size={18} className="animate-spin mr-2" />Loading...
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No users found</p>
          ) : (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">{(u.full_name || "?")[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{u.full_name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{u.role?.replace(/_/g, " ")}</span>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      u.is_active ? "bg-secondary/40 text-secondary-foreground" : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {u.is_active ? "Active" : "Disabled"}
                  </span>
                  <button onClick={() => handleDelete(u.id)} className="text-muted-foreground hover:text-destructive transition p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "audit" && (
        <div className="rounded-2xl border border-border bg-card p-5">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 size={18} className="animate-spin mr-2" />Loading...
            </div>
          ) : audit.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No audit logs yet. Start querying your knowledge base.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {audit.map((l, i) => (
                <div key={i} className="rounded-xl border border-border bg-background px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-foreground/80 flex-1">{l.query}</p>
                    <span className={`text-xs font-medium flex-shrink-0 ${CONF_COLORS[l.confidence_label] || "text-muted-foreground"}`}>
                      {l.confidence_label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{l.answer}</p>
                  <p className="mt-1 text-xs text-muted-foreground/60">{l.created_at ? new Date(l.created_at).toLocaleString() : ""}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}