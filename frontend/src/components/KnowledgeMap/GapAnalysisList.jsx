import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { getGapAnalysis } from '../../services/api';

const severityStyle = {
  critical: { badge: 'rgba(165, 61, 76, 0.15)', badgeText: '#a53d4c', bar: '#a53d4c' },
  'high-risk': { badge: 'rgba(217, 154, 61, 0.15)', badgeText: '#d99a3d', bar: '#d99a3d' },
};

const panelStyle = { background: 'var(--color-surface)', border: '1px solid var(--color-border)' };

export default function GapAnalysisList({ onStatsLoaded }) {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGapAnalysis();
      setGaps(data.recent_gaps || []);
      onStatsLoaded?.(data);
      setError(null);
    } catch (e) {
      setError(e?.message || 'Failed to load gap analysis');
    } finally {
      setLoading(false);
    }
  }, [onStatsLoaded]);

  useEffect(() => { load(); }, [load]);

  const RefreshButton = (
    <button
      onClick={load}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition mb-4"
      style={{ ...panelStyle, color: 'var(--color-rose-muted)' }}
    >
      <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
    </button>
  );

  if (loading && gaps.length === 0) {
    return (
      <>
        {RefreshButton}
        <div className="rounded-2xl p-10 flex items-center justify-center gap-2" style={{ ...panelStyle, color: 'var(--color-rose-muted)' }}>
          <Loader2 size={18} className="animate-spin" /> Loading gap analysis…
        </div>
      </>
    );
  }
  if (error) {
    return (
      <>
        {RefreshButton}
        <div className="rounded-2xl p-10 text-center" style={{ ...panelStyle, color: '#e07a7a' }}>Couldn't load gap analysis: {error}</div>
      </>
    );
  }
  if (gaps.length === 0) {
    return (
      <>
        {RefreshButton}
        <div className="rounded-2xl p-10 text-center" style={{ ...panelStyle, color: 'var(--color-rose-muted)' }}>
          No gaps yet — once people start asking questions your AI Assistant can't confidently answer, they'll show up here automatically.
        </div>
      </>
    );
  }

  return (
    <div>
      {RefreshButton}
      <div className="space-y-3">
        {gaps.map((g) => {
          const s = severityStyle[g.severity] || severityStyle['high-risk'];
          return (
            <div key={g.id} className="rounded-2xl p-4 sm:p-5" style={panelStyle}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <AlertTriangle size={18} style={{ color: s.badgeText, marginTop: 2, flexShrink: 0 }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-base font-semibold truncate" style={{ color: 'var(--color-cream)' }}>
                        {g.query}
                      </h3>
                      <span
                        className="text-xs rounded-full px-2 py-0.5 flex-shrink-0"
                        style={{ background: s.badge, color: s.badgeText }}
                      >
                        {g.severity}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-rose-muted)' }}>
                      Asked in {g.domain_name}
                      {g.created_at ? ` · ${new Date(g.created_at).toLocaleString()}` : ''}
                    </p>
                  </div>
                </div>

                <div className="w-full text-left sm:w-32 sm:flex-shrink-0 sm:text-right">
                  <p className="text-xs mb-1.5" style={{ color: s.badgeText }}>{g.confidence}% confidence</p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-hover)' }}>
                    <div className="h-full rounded-full" style={{ width: `${g.confidence}%`, background: s.bar }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
