/*import { Link } from "react-router-dom";
import { Brain, FileSearch, Shield, Zap, Globe, BarChart3, ArrowRight, CheckCircle } from "lucide-react";

const FEATURES = [
  { icon: FileSearch, title: "Smart Document Q&A", desc: "Ask questions in plain language. Get cited answers from your own documents." },
  { icon: Shield, title: "PII Sanitisation", desc: "Every document stripped of personal data before reaching any AI model." },
  { icon: Brain, title: "AI Confidence Scoring", desc: "Every answer rated for reliability so you always know how much to trust it." },
  { icon: Globe, title: "Multilingual Support", desc: "Ask in Tamil, Hindi, French or 100+ languages. Get answers in the same language." },
  { icon: Zap, title: "Voice Query", desc: "Speak your question. Whisper transcribes it and the AI answers." },
  { icon: BarChart3, title: "Audit Trail", desc: "Every query, every answer, every source — logged for compliance." },
];

const DOMAINS = [
  { n:"HR", e:"👥", d:"Leave policies, onboarding, compliance" },
  { n:"Finance", e:"💰", d:"Reports, vendor contracts, invoicing" },
  { n:"IT", e:"💻", d:"Runbooks, incidents, code review" },
  { n:"Manufacturing", e:"🏭", d:"Equipment manuals, safety alerts" },
  { n:"Sales", e:"📈", d:"Battlecards, proposals, intel" },
  { n:"Legal", e:"⚖️", d:"Contract review, regulatory compliance" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F8EF7]"><Brain size={16} className="text-white" /></div>
            <span className="text-lg font-bold">Think<span className="text-[#4F8EF7]">Hive</span></span>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white/40 transition">Sign In</Link>
            <Link to="/register" className="rounded-lg bg-[#4F8EF7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 transition">Register Company</Link>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#4F8EF7]/8 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-[#2DD4A7]/8 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4F8EF7]/30 bg-[#4F8EF7]/10 px-4 py-1.5 text-sm text-[#4F8EF7]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F8EF7] animate-pulse" /> Enterprise RAG Platform
          </span>
          <h1 className="mt-4 text-5xl font-bold leading-tight md:text-6xl">
            Your Organisation Knows Everything.<br />
            <span className="text-[#4F8EF7]">Your Employees Can Find Nothing.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            ThinkHive converts your unstructured documents into a conversational, cited, and auditable knowledge base. Ask anything. Get answers from your own files. In any language.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/register" className="flex items-center gap-2 rounded-xl bg-[#4F8EF7] px-8 py-4 text-base font-semibold text-white hover:bg-[#4F8EF7]/90 transition">
              Register Your Company <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="rounded-xl border border-white/20 px-8 py-4 text-base text-white/80 hover:border-white/40 transition">Sign In</Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/40">
            {["No credit card required","5-minute setup","Your data stays yours"].map(t=>(
              <span key={t} className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#2DD4A7]"/>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-center text-white/50 mb-16">Three steps from raw documents to intelligent answers</p>
        <div className="grid gap-8 md:grid-cols-3">
          {[{n:"01",t:"Upload Documents",d:"PDF, DOCX, TXT — digital or scanned. OCR handles scanned files.",c:"text-[#4F8EF7]"},{n:"02",t:"Sanitise & Index",d:"PII removed, chunked, embedded, stored in your private vector database.",c:"text-[#2DD4A7]"},{n:"03",t:"Ask & Get Cited Answers",d:"AI answers with source citations, confidence scores, and full audit trail.",c:"text-[#F7C84F]"}].map(({n,t,d,c})=>(
            <div key={n} className="rounded-2xl border border-white/10 bg-[#131929] p-8">
              <span className={`text-5xl font-bold ${c} opacity-30`}>{n}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{t}</h3>
              <p className="mt-2 text-sm text-white/50">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold mb-4">Everything You Need</h2>
        <p className="text-center text-white/50 mb-16">Built for enterprise teams who take knowledge seriously</p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({icon:Icon,title,desc})=>(
            <div key={title} className="rounded-2xl border border-white/10 bg-[#131929] p-6 hover:border-[#4F8EF7]/30 transition">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F8EF7]/10"><Icon size={20} className="text-[#4F8EF7]"/></div>
              <h3 className="mb-1.5 font-semibold text-white">{title}</h3>
              <p className="text-sm text-white/50">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold mb-4">Works For Every Department</h2>
        <p className="text-center text-white/50 mb-16">Create separate knowledge domains for each team</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map(({n,e,d})=>(
            <div key={n} className="rounded-xl border border-white/10 bg-[#131929] p-5 hover:border-[#4F8EF7]/30 transition">
              <span className="text-2xl">{e}</span>
              <h3 className="mt-2 font-semibold text-white">{n}</h3>
              <p className="mt-1 text-sm text-white/50">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="rounded-3xl border border-[#4F8EF7]/20 bg-[#131929] p-12">
          <h2 className="text-3xl font-bold text-white">Ready to unlock your organisation's knowledge?</h2>
          <p className="mt-4 text-white/50">Register your company and get started in under 5 minutes.</p>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#4F8EF7] px-10 py-4 font-semibold text-white hover:bg-[#4F8EF7]/90 transition">
            Get Started Free <ArrowRight size={18}/>
          </Link>
        </div>
      </section>
      <footer className="border-t border-white/5 py-8 text-center text-sm text-white/30">© {new Date().getFullYear()} ThinkHive. All rights reserved.</footer>
    </div>
  );
}*/
import { Link } from "react-router-dom";
import { Brain, FileSearch, Shield, Zap, Globe, BarChart3, ArrowRight, CheckCircle } from "lucide-react";

const FEATURES = [
  { icon: FileSearch, title: "Smart Document Q&A", desc: "Ask questions in plain language. Get cited answers from your own documents." },
  { icon: Shield, title: "PII Sanitisation", desc: "Every document stripped of personal data before reaching any AI model." },
  { icon: Brain, title: "AI Confidence Scoring", desc: "Every answer rated for reliability so you always know how much to trust it." },
  { icon: Globe, title: "Multilingual Support", desc: "Ask in Tamil, Hindi, French or 100+ languages. Get answers in the same language." },
  { icon: Zap, title: "Voice Query", desc: "Speak your question. Whisper transcribes it and the AI answers." },
  { icon: BarChart3, title: "Audit Trail", desc: "Every query, every answer, every source — logged for compliance." },
];

const DOMAINS = [
  { n: "HR", e: "👥", d: "Leave policies, onboarding, compliance" },
  { n: "Finance", e: "💰", d: "Reports, vendor contracts, invoicing" },
  { n: "IT", e: "💻", d: "Runbooks, incidents, code review" },
  { n: "Manufacturing", e: "🏭", d: "Equipment manuals, safety alerts" },
  { n: "Sales", e: "📈", d: "Battlecards, proposals, intel" },
  { n: "Legal", e: "⚖️", d: "Contract review, regulatory compliance" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV — floating glass pill, matches Figma nav */}
      <nav className="fixed top-3 left-3 right-3 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/50 bg-white/55 px-5 py-2.5 shadow-[0_4px_24px_rgba(66,12,20,0.08)] backdrop-blur-2xl">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain size={16} className="text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Think<span className="text-primary">Hive</span>
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground/80 transition hover:border-foreground/40"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Register Company
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Enterprise RAG Platform
          </span>
          <h1 className="font-display mt-4 text-5xl leading-tight md:text-6xl">
            Your Organisation Knows Everything.<br />
            <span className="text-primary">Your Employees Can Find Nothing.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70">
            ThinkHive converts your unstructured documents into a conversational, cited, and auditable
            knowledge base. Ask anything. Get answers from your own files. In any language.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Register Your Company <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-border px-8 py-4 text-base text-foreground/80 transition hover:border-foreground/40"
            >
              Sign In
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-foreground/50">
            {["No credit card required", "5-minute setup", "Your data stays yours"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-secondary-foreground/70" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-center text-3xl mb-4">How It Works</h2>
        <p className="mb-16 text-center text-foreground/50">Three steps from raw documents to intelligent answers</p>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { n: "01", t: "Upload Documents", d: "PDF, DOCX, TXT — digital or scanned. OCR handles scanned files." },
            { n: "02", t: "Sanitise & Index", d: "PII removed, chunked, embedded, stored in your private vector database." },
            { n: "03", t: "Ask & Get Cited Answers", d: "AI answers with source citations, confidence scores, and full audit trail." },
          ].map(({ n, t, d }) => (
            <div key={n} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <span className="text-5xl font-bold text-primary opacity-30">{n}</span>
              <h3 className="font-display mt-4 text-lg">{t}</h3>
              <p className="mt-2 text-sm text-foreground/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-center text-3xl mb-4">Everything You Need</h2>
        <p className="mb-16 text-center text-foreground/50">Built for enterprise teams who take knowledge seriously</p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/40"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="mb-1.5 font-semibold">{title}</h3>
              <p className="text-sm text-foreground/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DOMAINS */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-center text-3xl mb-4">Works For Every Department</h2>
        <p className="mb-16 text-center text-foreground/50">Create separate knowledge domains for each team</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map(({ n, e, d }) => (
            <div
              key={n}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40"
            >
              <span className="text-2xl">{e}</span>
              <h3 className="mt-2 font-semibold">{n}</h3>
              <p className="mt-1 text-sm text-foreground/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="rounded-3xl border border-primary/20 bg-card p-12 shadow-sm">
          <h2 className="font-display text-3xl">Ready to unlock your organisation's knowledge?</h2>
          <p className="mt-4 text-foreground/60">Register your company and get started in under 5 minutes.</p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-foreground/40">
        © {new Date().getFullYear()} ThinkHive. All rights reserved.
      </footer>
    </div>
  );
}
