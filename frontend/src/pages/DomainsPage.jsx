import { useEffect, useMemo, useState } from "react";
import { Grid2X2, List, Loader2, Plus } from "lucide-react";
import DomainCard from "../components/Domains/DomainCard";
import CreateDomainModal from "../components/Domains/CreateDomainModal";
import { useDomainStore } from "../store/useDomainStore";

const demoDomains = [
  { id: "demo-1", name: "thinkhive.io", domain_type: "cloudflare", member_count: 42, document_count: 118, description: "Primary workspace domain" },
  { id: "demo-2", name: "techhub.io", domain_type: "cloudflare", member_count: 18, document_count: 54, description: "Engineering domain" },
  { id: "demo-3", name: "staging-platform.dev", domain_type: "namecheap", member_count: 9, document_count: 22, description: "Staging and QA" },
];

export default function DomainsPage() {
  const { domains, isLoading, fetch } = useDomainStore();
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("list");
  useEffect(() => { fetch(); }, []);
  const visibleDomains = useMemo(() => domains.length ? domains : demoDomains, [domains]);

  return (
    <div className="th-page space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Domains</h1>
          <p className="mt-1 text-muted-foreground">32 domains · 1 expiring soon · 1 expired · Click a row for details</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-card p-1">
            <button onClick={() => setView("grid")} className={`rounded-lg p-2.5 ${view === "grid" ? "bg-primary/14" : "text-muted-foreground"}`} aria-label="Grid view">
              <Grid2X2 size={18} />
            </button>
            <button onClick={() => setView("list")} className={`rounded-lg p-2.5 ${view === "list" ? "bg-primary/14" : "text-muted-foreground"}`} aria-label="List view">
              <List size={18} />
            </button>
          </div>
          <button onClick={() => setShowModal(true)} className="th-button">
            <Plus size={16} /> Add domain
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={20} className="mr-2 animate-spin" /> Loading...
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleDomains.map((d) => <DomainCard key={d.id} domain={d} />)}
        </div>
      ) : (
        <div className="th-card overflow-x-auto">
          <div className="grid min-w-[760px] grid-cols-[1fr_160px_140px_120px_40px] border-b border-border px-5 py-4 font-mono text-sm text-muted-foreground">
            <span>Domain</span>
            <span>Registrar</span>
            <span>Status</span>
            <span>SSL</span>
            <span />
          </div>
          <div className="min-w-[760px]">
            {visibleDomains.map((d) => <DomainCard key={d.id} domain={d} compact />)}
          </div>
        </div>
      )}

      {showModal && <CreateDomainModal onClose={() => { setShowModal(false); fetch(); }} />}
    </div>
  );
}
