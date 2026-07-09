import { useEffect, useState } from "react";
import { UserPlus, Users, Loader2, Mail } from "lucide-react";
import AddMemberModal from "../components/HR/AddMemberModal";
import BulkUploadCSV from "../components/HR/BulkUploadCSV";
import { getMembers } from "../services/api";

export default function HRPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function load() { setLoading(true); try { const r = await getMembers(); setMembers(r.members || []); } catch {} setLoading(false); }
  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">HR & Members</h1>
          <p className="mt-1 text-muted-foreground">Manage team members, roles, and bulk onboarding</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
        >
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-base text-foreground mb-4 flex items-center gap-2">
            <Users size={17} className="text-primary" />Team Members ({members.length})
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 size={18} className="animate-spin mr-2" />Loading...
            </div>
          ) : members.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No members yet. Add your first team member.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">{(m.full_name || "?")[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.full_name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10} />{m.email}</p>
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium capitalize bg-secondary/40 text-secondary-foreground">
                    {m.role?.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-base text-foreground mb-4">Bulk Upload</h2>
          <BulkUploadCSV onSuccess={load} />
        </div>
      </div>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} onSuccess={load} />}
    </div>
  );
}