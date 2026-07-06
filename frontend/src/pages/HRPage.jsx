import { useEffect, useState } from "react";
import { UserPlus, Users, Loader2, Mail, Shield } from "lucide-react";
import AddMemberModal from "../components/HR/AddMemberModal";
import BulkUploadCSV from "../components/HR/BulkUploadCSV";
import { getMembers } from "../services/api";

const ROLE_COLORS = { org_super_admin:"bg-purple-500/20 text-purple-400", manager:"bg-blue-500/20 text-blue-400", employee:"bg-white/10 text-white/60", guest:"bg-gray-500/20 text-gray-400" };

export default function HRPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function load() { setLoading(true); try { const r = await getMembers(); setMembers(r.members||[]); } catch {} setLoading(false); }
  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">HR & Members</h1><p className="mt-1 text-white/50">Manage team members, roles, and bulk onboarding</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-[#4F8EF7] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 transition">
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#131929] p-5">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2"><Users size={17} className="text-[#4F8EF7]"/>Team Members ({members.length})</h2>
          {loading ? <div className="flex items-center justify-center py-8 text-white/40"><Loader2 size={18} className="animate-spin mr-2"/>Loading...</div>
          : members.length === 0 ? <p className="text-sm text-white/40 py-6 text-center">No members yet. Add your first team member.</p>
          : <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0B0F1A] px-3 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4F8EF7]/20 flex-shrink-0">
                    <span className="text-xs font-semibold text-[#4F8EF7]">{(m.full_name||"?")[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{m.full_name}</p>
                    <p className="text-xs text-white/40 flex items-center gap-1"><Mail size={10}/>{m.email}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_COLORS[m.role]||ROLE_COLORS.employee}`}>
                    {m.role?.replace(/_/g," ")}
                  </span>
                </div>
              ))}
            </div>}
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#131929] p-5">
          <h2 className="text-base font-semibold text-white mb-4">Bulk Upload</h2>
          <BulkUploadCSV onSuccess={load} />
        </div>
      </div>
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} onSuccess={load} />}
    </div>
  );
}
