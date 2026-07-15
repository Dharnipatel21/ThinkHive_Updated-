import React, { useState } from 'react';
import SolarSystem from '../components/KnowledgeMap/SolarSystem';
import GapAnalysisList from '../components/KnowledgeMap/GapAnalysisList';

const StatCard = ({ value, label, sublabel }) => (
  <div className="rounded-2xl p-4 sm:p-5" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
    <p className="font-display text-xl font-bold sm:text-2xl" style={{ color: 'var(--color-cream)' }}>{value}</p>
    <p className="text-sm mt-0.5" style={{ color: 'var(--color-cream)' }}>{label}</p>
    <p className="text-xs mt-0.5" style={{ color: 'var(--color-rose-muted)' }}>{sublabel}</p>
  </div>
);

const KnowledgeMapPage = () => {
  const [tab, setTab] = useState('coverage');
  const [gapStats, setGapStats] = useState(null);

  return (
    <div className="min-h-full w-full">
      <div className="mb-6 flex items-start gap-3 sm:items-center">
        <span className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'rgba(201, 151, 71, 0.12)', color: '#c9974a' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="2.5" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(45 12 12)" />
          </svg>
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: 'var(--color-cream)' }}>Knowledge Gap &amp; Map</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-rose-muted)' }}>
            Your organization's documents mapped as an orbital system, and real gaps found in how well they answer questions
          </p>
        </div>
      </div>

      {gapStats && (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <StatCard value={`${gapStats.avg_coverage}%`} label="Avg Coverage" sublabel={`across ${gapStats.domains_analyzed} analyzed domain(s)`} />
          <StatCard value={gapStats.critical_count} label="Critical Gaps" sublabel="require urgent action" />
          <StatCard value={gapStats.high_risk_count} label="Watch List" sublabel="monitor closely" />
          <StatCard value={gapStats.total_domains} label="Domains" sublabel="total in your org" />
        </div>
      )}

      <div className="mb-6 flex max-w-full gap-1 overflow-x-auto rounded-xl p-1" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        {[{ k: 'coverage', label: 'Coverage Map' }, { k: 'gaps', label: 'Gap Analysis' }].map(({ k, label }) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4"
            style={tab === k ? { background: '#c9974a', color: '#2B0A0F' } : { color: 'var(--color-rose-muted)' }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'coverage' ? <SolarSystem /> : <GapAnalysisList onStatsLoaded={setGapStats} />}
    </div>
  );
};

export default KnowledgeMapPage;
