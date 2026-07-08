import React from 'react';
import SolarSystem from '../components/KnowledgeMap/SolarSystem';

const KnowledgeMapPage = () => {
  return (
    <div className="w-full min-h-full p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{ background: 'rgba(201, 151, 71, 0.12)', color: '#c9974a' }}
        >
          {/* orbit icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="2.5" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(45 12 12)" />
          </svg>
        </span>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display" style={{ color: 'var(--color-cream)' }}>
            Knowledge Map
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-rose-muted)' }}>
            Your organization's documents, mapped as an orbital system
          </p>
        </div>
      </div>

      <SolarSystem />
    </div>
  );
};

export default KnowledgeMapPage;