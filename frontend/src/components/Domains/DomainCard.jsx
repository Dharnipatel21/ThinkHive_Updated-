import { FileText, Globe2, Trash2, Users } from "lucide-react";
import { useDomainStore } from "../../store/useDomainStore";

export default function DomainCard({ domain, compact = false }) {
  const { remove } = useDomainStore();

  if (compact) {
    return (
      <div className="grid grid-cols-[1fr_160px_140px_120px_40px] items-center border-b border-border px-5 py-4 last:border-b-0">
        <p className="font-mono font-bold text-foreground">{domain.name}</p>
        <p className="text-muted-foreground capitalize">{domain.domain_type}</p>
        <span className="rounded-full bg-secondary/35 px-3 py-1 text-sm font-semibold text-secondary-foreground">active</span>
        <p className="text-primary">Valid</p>
        <button onClick={() => remove(domain.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <Trash2 size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="group th-card relative p-5 transition hover:border-primary/45">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <Globe2 size={22} />
        </div>
        <button onClick={() => remove(domain.id)} className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100">
          <Trash2 size={14} />
        </button>
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">{domain.name}</h3>
      <p className="mt-0.5 text-xs capitalize text-muted-foreground">{domain.domain_type}</p>
      {domain.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{domain.description}</p>}
      <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Users size={12} />{domain.member_count} members</span>
        <span className="flex items-center gap-1"><FileText size={12} />{domain.document_count} docs</span>
      </div>
    </div>
  );
}
