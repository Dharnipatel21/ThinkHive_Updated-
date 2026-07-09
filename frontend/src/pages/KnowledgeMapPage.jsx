import { useState } from "react";
import { AlertTriangle, Brain } from "lucide-react";

const departments = [
  {
    name: "Engineering",
    color: "bg-[#ABA361]",
    skills: [
      ["Frontend", 85, "good"],
      ["Backend", 90, "good"],
      ["DevOps", 72, "good"],
      ["Security", 35, "risk"],
      ["ML / AI", 48, "risk"],
    ],
  },
  {
    name: "Product",
    color: "bg-[#B23A3A]",
    skills: [
      ["Roadmapping", 78, "good"],
      ["Analytics", 64, "good"],
      ["Go-to-Market", 28, "risk"],
      ["Research Ops", 56, "warn"],
    ],
  },
  {
    name: "HR",
    color: "bg-[#BAD9B5]",
    skills: [
      ["Onboarding", 82, "good"],
      ["Compliance", 70, "good"],
      ["L&D", 40, "risk"],
      ["Compensation", 62, "warn"],
    ],
  },
];

const gaps = [
  ["Product -> Go-to-Market", "critical", "Partner with marketing to build GTM competency - consider an external workshop.", 28],
  ["Engineering -> Security", "critical", "Hire 1-2 security engineers or enroll existing staff in an accredited programme.", 35],
  ["HR -> L&D", "high", "Hire an L&D specialist or contract a training provider for a pilot cohort.", 40],
];

function Stat({ value, label, hint, danger }) {
  return (
    <div className="th-card p-5">
      <p className={`font-display text-3xl ${danger ? "text-destructive" : "text-secondary-foreground"}`}>{value}</p>
      <p className="mt-2 font-semibold text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export default function KnowledgeMapPage() {
  const [tab, setTab] = useState("coverage");

  return (
    <div className="th-page space-y-7">
      <section>
        <h1 className="font-display text-3xl text-foreground">Knowledge Gap & Map</h1>
        <p className="mt-1 text-muted-foreground">Visualise team competencies and identify critical skill gaps across departments.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat value="68%" label="Avg Coverage" hint="across 4 depts" />
        <Stat value="2" label="Critical Gaps" hint="require urgent action" danger />
        <Stat value="2" label="High-Risk Gaps" hint="monitor closely" danger />
        <Stat value="19" label="Skills Mapped" hint="across all teams" />
      </section>

      <div className="inline-flex rounded-lg bg-card p-1">
        {[
          ["coverage", "Coverage Map"],
          ["analysis", "Gap Analysis"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-lg px-5 py-3 text-sm font-semibold ${tab === key ? "bg-primary/12 text-foreground" : "text-muted-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "coverage" ? (
        <section className="space-y-5">
          {departments.map((dept) => (
            <div key={dept.name} className="th-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className={`h-4 w-4 rounded-full ${dept.color}`} />
                <h2 className="font-display text-2xl">{dept.name}</h2>
              </div>
              <div className="space-y-4">
                {dept.skills.map(([name, pct, status]) => (
                  <div key={name}>
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex-1 font-semibold">{name}</span>
                      <span className={`rounded bg-muted px-2 py-1 font-mono text-sm ${status === "risk" ? "text-destructive" : "text-secondary-foreground"}`}>{pct}%</span>
                      {status === "risk" && <AlertTriangle size={15} className="text-destructive" />}
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${status === "risk" ? "bg-destructive" : "bg-secondary-foreground"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="space-y-4">
          {gaps.map(([title, level, text, pct]) => (
            <div key={title} className="th-card flex flex-col gap-4 p-6 lg:flex-row lg:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/12 text-destructive">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold">{title}</h2>
                  <span className="rounded-full bg-destructive/15 px-2 py-1 text-xs font-semibold text-destructive">{level}</span>
                </div>
                <p className="mt-2 text-muted-foreground">{text}</p>
              </div>
              <div className="min-w-56">
                <p className="mb-2 font-mono text-sm text-destructive">{pct}% coverage</p>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-destructive" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
