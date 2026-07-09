import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import ThemeToggle from "./ThemeToggle";

const LABELS = {
  dashboard: "Overview",
  chat: "AI Assistant",
  documents: "Documents",
  search: "Search",
  domains: "Domains",
  hr: "HR",
  "knowledge-map": "Knowledge Map",
  admin: "Admin",
};

export default function TopBar() {
  const { user } = useAuthStore();
  const location = useLocation();
  const segment = location.pathname.split("/").filter(Boolean)[0] || "dashboard";
  const label = LABELS[segment] || "Dashboard";
  const initials = (user?.full_name || "Alex Kim")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex min-h-[68px] items-center justify-between border-b border-border bg-card/90 px-5 py-3 pl-16 backdrop-blur md:px-7 md:pl-7">
      <div className="flex items-center gap-2 text-sm md:text-base">
        <span className="text-muted-foreground">Dashboard</span>
        <span className="text-muted-foreground">›</span>
        <span className="font-semibold text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden w-44 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm sm:flex lg:w-56">
          <Search size={15} />
          <span className="flex-1">Search...</span>
          <kbd className="rounded bg-card px-1.5 py-0.5 font-mono text-xs opacity-70">⌘K</kbd>
        </div>
        <button className="relative rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <ThemeToggle />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {initials}
        </div>
      </div>
    </header>
  );
}
