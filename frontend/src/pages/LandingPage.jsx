import { Link } from "react-router-dom";
import { ArrowRight, Bot, Brain, Check, FileText, Globe2, Lock, Search, Shield, Users } from "lucide-react";
import ThemeToggle from "../components/Layout/ThemeToggle";

const modules = [
  [Bot, "AI Assistant", "Intelligent workflow automation and natural-language querying across all your data."],
  [FileText, "Documents", "Unified document management with version control and granular role-based access."],
  [Search, "Search", "Instant semantic search across people, files, domains, and activity logs."],
  [Globe2, "Domains", "Full DNS and domain lifecycle visibility - renewals, DNS records, SSL status."],
  [Users, "HR", "People directory, org charts, onboarding workflows, and compliance tracking."],
  [Shield, "Admin", "Role-based access control, audit logs, and granular permission matrices."],
  [Brain, "Knowledge Gap & Map", "Visualise team competencies, identify skill gaps, and build targeted learning paths."],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed inset-x-3 top-3 z-50 rounded-lg border border-border bg-card/90 px-6 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain size={18} />
            </div>
            <span className="font-display text-xl font-bold">ThinkHive</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-foreground/78 md:flex">
            <a href="#features">Features</a>
            <a href="#process">How it Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About Us</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="th-button">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <section className="th-panel-band grid min-h-screen items-center gap-12 px-6 pb-16 pt-28 lg:grid-cols-[1.4fr_1fr] lg:px-20">
        <div className="max-w-3xl">
          <span className="th-chip mb-12 text-primary">AI-Powered Administration</span>
          <h1 className="th-type text-5xl font-bold leading-tight text-foreground md:text-6xl">
            One platform to manage your HR.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-8 text-foreground/72">
            ThinkHive unifies HR, domains, documents, knowledge mapping, and AI-driven automation under one elegant platform.
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link to="/register" className="th-button px-8 py-4 text-lg">
              Start free trial <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="th-button-secondary px-8 py-4 text-lg">
              Watch demo <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-4">
            {["SC", "MR", "PP", "JO", "EV"].map((i, index) => (
              <span key={i} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground" style={{ marginLeft: index ? -22 : 0 }}>
                {i}
              </span>
            ))}
            <span className="font-semibold">2,400+ <span className="font-normal text-muted-foreground">teams worldwide</span></span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm space-y-4">
          <div className="th-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">Platform Overview</h2>
              <span className="h-2.5 w-2.5 rounded-full bg-secondary-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["148", "Employees"],
                ["32", "Domains"],
                ["1.2k", "Documents"],
                ["99.8%", "Uptime"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-lg bg-muted/40 p-4">
                  <p className="font-display text-2xl">{n}</p>
                  <p className="text-xs text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="th-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><Brain size={16} className="text-primary" /> Knowledge Gap Alert</h2>
            {[
              ["Security", 35],
              ["Go-to-Market", 28],
            ].map(([label, pct]) => (
              <div key={label} className="mb-3">
                <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="text-destructive">{pct}%</span></div>
                <div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-destructive" style={{ width: `${pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-24 lg:px-20">
        <p className="mb-5 font-mono text-sm uppercase tracking-[0.35em] text-primary">Everything you need</p>
        <h2 className="font-display max-w-2xl text-5xl leading-tight">Seven modules. One command centre.</h2>
        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(([Icon, title, desc]) => (
            <div key={title} className="th-card p-8">
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/12 text-primary"><Icon size={22} /></div>
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="process" className="border-t border-primary/55 bg-card/55 px-6 py-24 text-center lg:px-20">
        <p className="font-mono text-sm uppercase tracking-[0.35em] text-primary">Simple process</p>
        <h2 className="mt-5 font-display text-5xl">Up and running in minutes</h2>
        <div className="mx-auto mt-16 grid max-w-7xl gap-8 text-left md:grid-cols-4">
          {[
            ["01", "Connect your workspace", "Link your existing tools with native integrations - no configuration headaches."],
            ["02", "Configure your roles", "Set granular permissions for every team member with our visual role builder."],
            ["03", "Invite your team", "Onboard users with automated welcome flows and instant role assignment."],
            ["04", "Operate confidently", "Monitor, manage, and iterate with a real-time audit trail behind everything."],
          ].map(([n, title, desc]) => (
            <div key={n}>
              <p className="font-mono text-6xl font-bold text-primary/30">{n}</p>
              <h3 className="mt-4 font-display text-2xl">{title}</h3>
              <p className="mt-3 text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-primary bg-card px-6 py-24 text-center">
        <h2 className="font-display text-5xl">Ready to take control?</h2>
        <p className="mt-6 text-xl text-muted-foreground">Start free. No credit card required. Full platform access for 14 days.</p>
        <Link to="/register" className="th-button mt-10 px-10 py-4 text-lg">Start free trial <ArrowRight size={18} /></Link>
      </section>

      <footer id="about" className="flex flex-col gap-4 border-t border-border px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between lg:px-20">
        <span className="flex items-center gap-3 font-display text-lg font-bold text-foreground"><Brain size={17} /> ThinkHive</span>
        <div className="flex gap-8"><span>Privacy</span><span>Terms</span><span>Security</span><span>Status</span><span>Docs</span></div>
        <span>© 2026 ThinkHive, Inc.</span>
      </footer>
    </div>
  );
}
