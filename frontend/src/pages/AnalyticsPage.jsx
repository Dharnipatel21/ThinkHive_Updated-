import { useEffect, useState } from "react";
import {
  BarChart3, MessageSquare, TrendingUp, AlertTriangle, Users, FileText,
  RefreshCw, Search, Activity, Clock,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend,
} from "recharts";
import {
  getAnalyticsOverview, getQueryTrends, getTopTopics,
  getDocumentUsageAnalytics, getUserActivityAnalytics, getConfidenceTrends,
} from "../services/api";
import AnimatedCounter from "../components/common/AnimatedCounter";

const GOLD = "#D4AF6A";
const SUCCESS = "#4ADE80";
const WARN = "#E0A952";
const DANGER = "#E05252";

function MetricCard({ icon: Icon, label, value, i = 0, suffix = "" }) {
  const numeric = typeof value === "number";
  return (
    <div
      className="stagger-item rounded-2xl border border-border bg-surface p-5"
      style={{ animationDelay: `${i * 70}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15">
          <Icon size={17} className="text-gold" />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-cream sm:text-3xl">
        {value == null ? "—" : numeric ? <AnimatedCounter value={value} suffix={suffix} /> : value}
      </p>
      <p className="mt-1 text-sm text-rose-muted">{label}</p>
    </div>
  );
}

function Panel({ title, icon: Icon, children, action }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-gold" />}
          <h2 className="font-display text-lg font-semibold text-cream">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  background: "var(--color-base-deep)",
  border: "1px solid var(--color-border)",
  borderRadius: 10,
  color: "var(--color-cream)",
  fontSize: 12,
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [queryTrends, setQueryTrends] = useState([]);
  const [confidenceTrends, setConfidenceTrends] = useState([]);
  const [topics, setTopics] = useState([]);
  const [docUsage, setDocUsage] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(14);

  async function load(range = days) {
    setLoading(true);
    try {
      const [ov, qt, ct, tt, du, ua] = await Promise.all([
        getAnalyticsOverview(),
        getQueryTrends(range),
        getConfidenceTrends(range),
        getTopTopics(8),
        getDocumentUsageAnalytics(8),
        getUserActivityAnalytics(8),
      ]);
      setOverview(ov);
      setQueryTrends(qt.series || []);
      setConfidenceTrends(ct.series || []);
      setTopics(tt.topics || []);
      setDocUsage(du.documents || []);
      setUserActivity(ua.users || []);
    } catch {
      /* metric cards fall back to "—" on failure */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(days); /* eslint-disable-next-line */ }, [days]);

  const fmtDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-cream sm:text-3xl">Knowledge Analytics</h1>
          <p className="mt-1 text-sm text-rose-muted sm:text-base">
            Org-wide query, usage, and knowledge-health trends · visible to super admins only
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                style={days === d ? { background: GOLD, color: "#1A0508" } : { color: "var(--color-rose-muted)" }}
              >
                {d}d
              </button>
            ))}
          </div>
          <button
            onClick={() => load(days)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-rose-muted hover:bg-white/5 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Overview metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard i={0} icon={MessageSquare} label="Total Queries" value={overview?.total_queries} />
        <MetricCard i={1} icon={Activity} label="Queries This Week" value={overview?.queries_this_week} />
        <MetricCard i={2} icon={TrendingUp} label="Avg Confidence" value={overview?.avg_confidence != null ? Math.round(overview.avg_confidence * 100) : null} suffix="%" />
        <MetricCard i={3} icon={Users} label="Active Users (7d)" value={overview?.active_users_this_week} />
        <MetricCard i={4} icon={FileText} label="Documents Indexed" value={overview?.total_documents} />
        <MetricCard i={5} icon={AlertTriangle} label="Contradictions Flagged" value={overview?.contradiction_count} />
        <MetricCard i={6} icon={Users} label="Total Members" value={overview?.total_members} />
        <MetricCard i={7} icon={Clock} label="Queries Today" value={overview?.queries_today} />
      </div>

      {/* Query analytics — volume over time */}
      <Panel title="Query Volume" icon={BarChart3}>
        {queryTrends.every((s) => s.count === 0) ? (
          <p className="text-sm text-rose-muted py-10 text-center">No queries in this window yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={queryTrends}>
              <defs>
                <linearGradient id="queryFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" tickFormatter={fmtDate} stroke="var(--color-rose-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="var(--color-rose-muted)" fontSize={11} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={fmtDate} />
              <Area type="monotone" dataKey="count" name="Queries" stroke={GOLD} strokeWidth={2} fill="url(#queryFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Panel>

      {/* Knowledge trends — confidence health over time */}
      <Panel title="Knowledge Trends — Answer Confidence" icon={TrendingUp}>
        {confidenceTrends.every((s) => s.high + s.medium + s.low === 0) ? (
          <p className="text-sm text-rose-muted py-10 text-center">No data in this window yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={confidenceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" tickFormatter={fmtDate} stroke="var(--color-rose-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="var(--color-rose-muted)" fontSize={11} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={tooltipStyle} labelFormatter={fmtDate} />
              <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-rose-muted)" }} />
              <Bar dataKey="high" name="High confidence" stackId="c" fill={SUCCESS} radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" name="Medium confidence" stackId="c" fill={WARN} />
              <Bar dataKey="low" name="Low confidence" stackId="c" fill={DANGER} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Most searched topics */}
        <Panel title="Most Searched Topics" icon={Search}>
          {topics.length === 0 ? (
            <p className="text-sm text-rose-muted py-6 text-center">No queries recorded yet</p>
          ) : (
            <div className="space-y-3">
              {topics.map((t, i) => {
                const max = topics[0].count || 1;
                return (
                  <div key={i} className="stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-cream truncate pr-2">{t.query}</span>
                      <span className="text-rose-muted flex-shrink-0">{t.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(t.count / max) * 100}%`, background: GOLD }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        {/* Document usage analytics */}
        <Panel title="Document Usage" icon={FileText}>
          {docUsage.length === 0 ? (
            <p className="text-sm text-rose-muted py-6 text-center">No documents cited in answers yet</p>
          ) : (
            <div className="space-y-3">
              {docUsage.map((d, i) => {
                const max = docUsage[0].times_referenced || 1;
                return (
                  <div key={i} className="stagger-item" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-cream truncate pr-2">{d.document_name}</span>
                      <span className="text-rose-muted flex-shrink-0">{d.times_referenced}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(d.times_referenced / max) * 100}%`, background: "var(--color-success)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      {/* User activity tracking */}
      <Panel title="User Activity" icon={Users}>
        {userActivity.length === 0 ? (
          <p className="text-sm text-rose-muted py-6 text-center">No user activity recorded yet</p>
        ) : (
          <>
            <div className="space-y-3 sm:hidden">
              {userActivity.map((u, i) => (
                <div key={u.user_id || i} className="rounded-xl border border-border bg-base p-4">
                  <p className="font-medium text-cream">{u.full_name}</p>
                  <p className="text-xs text-rose-muted">{u.email}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-rose-muted">Role</p>
                      <p className="capitalize text-cream">{(u.role || "").replace(/_/g, " ")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-rose-muted">Queries</p>
                      <p className="font-medium text-cream">{u.query_count}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-rose-muted">Last active</p>
                      <p className="text-cream">{u.last_active ? new Date(u.last_active).toLocaleDateString() : "—"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-semibold text-rose-muted">User</th>
                  <th className="text-left py-2 pr-4 font-semibold text-rose-muted">Role</th>
                  <th className="text-right py-2 pr-4 font-semibold text-rose-muted">Queries</th>
                  <th className="text-right py-2 font-semibold text-rose-muted">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {userActivity.map((u, i) => (
                  <tr key={u.user_id || i} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4">
                      <p className="text-cream">{u.full_name}</p>
                      <p className="text-xs text-rose-muted">{u.email}</p>
                    </td>
                    <td className="py-2.5 pr-4 text-rose-muted capitalize">{(u.role || "").replace(/_/g, " ")}</td>
                    <td className="py-2.5 pr-4 text-right text-cream font-medium">{u.query_count}</td>
                    <td className="py-2.5 text-right text-rose-muted">
                      {u.last_active ? new Date(u.last_active).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}