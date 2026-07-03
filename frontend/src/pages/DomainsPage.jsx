import { useEffect, useState } from "react";
import { Plus, FolderOpen, Loader2 } from "lucide-react";
import DomainCard from "../components/Domains/DomainCard";
import CreateDomainModal from "../components/Domains/CreateDomainModal";
import { useDomainStore } from "../store/useDomainStore";

export default function DomainsPage() {
  const { domains, isLoading, fetch } = useDomainStore();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => { fetch(); }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Domains</h1><p className="mt-1 text-white/50">Organise your knowledge base into separate domains per team or department</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-[#4F8EF7] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 transition">
          <Plus size={16} /> New Domain
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-white/40"><Loader2 size={20} className="animate-spin mr-2" /> Loading...</div>
      ) : domains.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <FolderOpen size={40} className="mb-3 text-white/20" />
          <p className="text-white/50 mb-4">No domains yet. Create your first domain to organise your knowledge base.</p>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-[#4F8EF7] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 transition">
            <Plus size={15} /> Create First Domain
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{domains.map(d => <DomainCard key={d.id} domain={d} />)}</div>
      )}
      {showModal && <CreateDomainModal onClose={() => { setShowModal(false); fetch(); }} />}
    </div>
  );
}
