import { NavLink } from "react-router-dom";
import {
  Bot,
  Brain,
  FileText,
  Globe2,
  Grid2X2,
  LogOut,
  Menu,
  Search,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const NAV = [
  { to: "/dashboard", icon: Grid2X2, label: "Overview" },
  { to: "/chat", icon: Bot, label: "AI Assistant" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/domains", icon: Globe2, label: "Domains" },
  { to: "/hr", icon: Users, label: "HR" },
  { to: "/knowledge-map", icon: Brain, label: "Knowledge Map" },
  { to: "/admin", icon: Shield, label: "Admin" },
];

function Logo({ expanded = true }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Brain size={20} />
      </div>
      {expanded && <span className="font-display text-xl font-bold text-sidebar-foreground">ThinkHive</span>}
    </div>
  );
}

function NavItems({ expanded, onSelect }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onSelect}
          title={label}
          className={({ isActive }) =>
            [
              "group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
              expanded ? "justify-start" : "justify-center",
              isActive
                ? "bg-primary/16 text-primary ring-1 ring-primary/25"
                : "text-sidebar-foreground/62 hover:bg-primary/10 hover:text-sidebar-foreground",
            ].join(" ")
          }
        >
          <Icon size={19} className="shrink-0" />
          <span className={expanded ? "whitespace-nowrap" : "sr-only"}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = (user?.full_name || "AK").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg md:hidden"
        aria-label="Open navigation"
      >
        <Menu size={19} />
      </button>

      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={[
          "hidden h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
          "transition-[width] duration-300 ease-out",
          expanded ? "w-64" : "w-[84px]",
        ].join(" ")}
      >
        <div className="border-b border-sidebar-border px-5 py-4">
          <Logo expanded={expanded} />
        </div>
        <NavItems expanded={expanded} />
        <div className="border-t border-sidebar-border p-3">
          <NavLink
            to="/admin"
            title="Settings"
            className="mb-2 flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm text-sidebar-foreground/62 hover:bg-primary/10 hover:text-sidebar-foreground"
          >
            <Settings size={18} />
            {expanded && <span>Settings</span>}
          </NavLink>
          <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${expanded ? "justify-start" : "justify-center"}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </div>
            {expanded && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">{user?.full_name || "Alex Kim"}</p>
                <p className="truncate text-xs text-sidebar-foreground/55">{user?.role?.replace(/_/g, " ") || "Admin"}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className={`mt-2 flex w-full min-h-10 items-center gap-3 rounded-lg px-3 text-sm text-destructive hover:bg-destructive/10 ${expanded ? "justify-start" : "justify-center"}`}
          >
            <LogOut size={18} />
            {expanded && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-foreground/25"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col border-r border-sidebar-border bg-sidebar shadow-2xl">
            <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
              <Logo />
              <button className="rounded-lg p-2 text-sidebar-foreground/70 hover:bg-muted" onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <NavItems expanded onSelect={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
