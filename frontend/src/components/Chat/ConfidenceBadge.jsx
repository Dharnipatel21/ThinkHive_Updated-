export default function ConfidenceBadge({ score, level }) {
  const map = {
    High: "bg-secondary/40 text-secondary-foreground border-secondary",
    Medium: "bg-primary/20 text-primary border-primary/40",
    Low: "bg-destructive/15 text-destructive border-destructive/30",
  };
  const l = level || "Low";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${map[l] || map.Low}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {l}{score !== undefined && ` · ${Math.round(score * 100)}%`}
    </span>
  );
}