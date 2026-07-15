import { useEffect, useState } from "react";
import { UserPlus, Users, Loader2, Mail } from "lucide-react";
import AddMemberModal from "../components/HR/AddMemberModal";
import BulkUploadCSV from "../components/HR/BulkUploadCSV";
import { getMembers } from "../services/api";

const ROLE_COLORS = {
  org_super_admin: "bg-gold/15 text-gold",
  manager: "bg-success/15 text-success",
  employee: "bg-white/10 text-rose-muted",
  guest: "bg-white/5 text-rose-muted/70",
};

const AVATAR_PALETTE = [
  "bg-gold/25 text-gold",
  "bg-success/25 text-success",
  "bg-danger/25 text-danger",
  "bg-warn/25 text-warn",
  "bg-white/15 text-cream",
];

function avatarStyle(str = "") {
  const hash = str.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initials(name = "?") {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function HRPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function load() { setLoading(true); try { const r = await getMembers(); setMembers(r.members || []); } catch {} setLoading(false); }
  useEffect(() => { load(); }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream sm:text-3xl">HR · People</h1>
          <p className="mt-1 text-sm text-rose-muted sm:text-base">{members.length} member{members.length !== 1 ? "s" : ""} · Manage team members, roles, and bulk onboarding</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-base-deep hover:bg-gold-light transition-colors sm:w-auto"
        >
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5 lg:col-span-2">
          <h2 className="font-display text-base font-semibold text-cream mb-4 flex items-center gap-2">
            <Users size={17} className="text-gold" /> Team Members
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-rose-muted">
              <Loader2 size={18} className="animate-spin mr-2" /> Loading...
            </div>
          ) : members.length === 0 ? (
            <p className="text-sm text-rose-muted py-6 text-center">No members yet. Add your first team member.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {members.map((m, i) => (
                <div
                  key={m.id}
                  className="stagger-item rounded-xl border border-border bg-base p-4 hover:border-gold/30 transition-colors"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full font-semibold ${avatarStyle(m.full_name)}`}>
                    {initials(m.full_name)}
                  </div>
                  <p className="mt-3 font-display font-semibold text-cream truncate">{m.full_name}</p>
                  <p className="text-xs text-rose-muted flex items-center gap-1 truncate">
                    <Mail size={10} className="flex-shrink-0" />{m.email}
                  </p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${ROLE_COLORS[m.role] || ROLE_COLORS.employee}`}>
                    {m.role?.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="font-display text-base font-semibold text-cream mb-4">Bulk Upload</h2>
          <BulkUploadCSV onSuccess={load} />
        </div>
      </div>

      {showModal && <AddMemberModal onClose={() => setShowModal(false)} onSuccess={load} />}
    </div>
  );
}