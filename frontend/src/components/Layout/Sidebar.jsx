import { NavLink } from "react-router-dom";
import { Brain, LayoutDashboard, MessageSquare, FileText, Search, Users, Settings, FolderOpen, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/chat", icon: MessageSquare, label: "AI Assistant" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/domains", icon: FolderOpen, label: "Domains" },
  { to: "/hr", icon: Users, label: "HR & Members" },
  { to: "/admin", icon: Settings, label: "Admin" },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  return (
    <aside className="flex h-full w-60 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Brain size={16} className="text-primary-foreground" />
        </div>
        <span className="font-display text-base font-bold text-sidebar-foreground">
          Think<span className="text-primary">Hive</span>
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
              ${isActive
                ? "bg-sidebar-active/15 text-sidebar-active"
                : "text-sidebar-foreground/50 hover:bg-sidebar-active/5 hover:text-sidebar-foreground/80"}`
            }
          >
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 rounded-xl bg-card px-3 py-2.5">
          <p className="text-sm font-medium text-foreground truncate">{user?.full_name || "User"}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace(/_/g, " ") || "Guest"}</p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive transition"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );
}
