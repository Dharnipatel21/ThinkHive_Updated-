import { useEffect, useState } from "react";
import { Bot, Brain, ChevronRight, FileText, Globe2, TrendingUp, Upload, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboardMetrics, getKnowledgeGaps, getPredictiveInsights } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

const fallbackActivity = [
  ["Sarah Chen added to Engineering team", "2m ago", Users],
  ["thinkhive.io domain renewed for 2 years", "15m ago", Globe2],
  ["Employee Handbook v4.2 uploaded", "1h ago", FileText],
  ["Security knowledge gap flagged - 35% coverage", "3h ago", Brain],
  ["Q2 compliance audit completed", "Yesterday", TrendingUp],
];

function MetricCard({ icon: Icon, label, value, delta }) {
  return (
    <div className="th-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/14 text-primary">
          <Icon size={19} />
        </div>
        {delta && <span className="text-sm font-bold text-secondary-foreground">{delta}</span>}
      </div>
      <p className="mt-5 font-display text-3xl text-foreground">{value ?? "0"}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [m, g, ins] = await Promise.all([getDashboardMetrics(), getKnowledgeGaps(), getPredictiveInsights()]);
        setMetrics(m);
        setGaps(g || []);
        setInsights(ins || []);
      } catch {
        setMetrics(null);
      }
    }
    load();
  }, []);

  const firstName = user?.full_name?.split(" ")[0] || "Alex";
  const coverage = metrics?.avg_confidence ? `${Math.round(metrics.avg_confidence * 100)}%` : "68%";

  return (
    <div className="th-page space-y-7">
      <section>
        <h1 className="font-display text-3xl text-foreground">Good morning, {firstName}</h1>
        <p className="mt-1 text-muted-foreground">Thursday, July 3, 2026 · Everything looks healthy</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Total Employees" value={metrics?.total_members || 148} delta="+12" />
        <MetricCard icon={Globe2} label="Active Domains" value={metrics?.total_domains || 32} delta="+2" />
        <MetricCard icon={FileText} label="Documents" value={metrics?.total_documents || "1,284"} delta="+47" />
        <MetricCard icon={Brain} label="Knowledge Coverage" value={coverage} delta="+5%" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="th-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent Activity</h2>
            <button className="text-sm font-semibold text-primary">View all</button>
          </div>
          <div className="divide-y divide-border">
            {fallbackActivity.map(([text, time, Icon]) => (
              <div key={text} className="flex items-center gap-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Icon size={17} />
                </div>
                <p className="flex-1 text-foreground/88">{text}</p>
                <span className="font-mono text-sm text-muted-foreground">{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="th-card p-6">
          <h2 className="font-display mb-5 text-2xl">Quick Actions</h2>
          {[
            ["/hr", "Add employee", Users],
            ["/domains", "Register domain", Globe2],
            ["/documents", "Upload document", Upload],
            ["/chat", "Ask AI Assistant", Bot],
            ["/knowledge-map", "View knowledge map", Brain],
          ].map(([to, label, Icon]) => (
            <Link key={label} to={to} className="flex items-center gap-4 rounded-lg px-2 py-4 text-foreground/88 hover:bg-muted/35">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 text-primary">
                <Icon size={17} />
              </div>
              <span className="flex-1 font-semibold">{label}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {(gaps.length > 0 || insights.length > 0) && (
        <section className="grid gap-5 lg:grid-cols-2">
          {[...gaps.slice(0, 3).map((g) => g.query), ...insights.slice(0, 3).map((i) => i.message)].map((item) => (
            <div key={item} className="th-card p-4 text-sm text-muted-foreground">{item}</div>
          ))}
        </section>
      )}
    </div>
  );
}
