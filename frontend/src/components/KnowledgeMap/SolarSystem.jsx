import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getKnowledgeMapDocuments } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

// Mirrors the exact hex values from index.css's :root.dark / :root.light
// blocks, so the canvas (which can't read CSS custom properties directly)
// stays in sync with whatever the rest of the app is doing.
const THEMES = {
  dark: {
    bgTop: '#2B0A0F',
    bgBottom: '#1A0508',
    panel: 'rgba(58, 16, 21, 0.92)',   // --color-surface
    panelBorder: '#4A1A1F',           // --color-border
    gold: '#c9974a',
    goldSoft: '#e0b876',
    textPrimary: '#F5EFE0',           // --color-cream
    textSecondary: '#B99A97',         // --color-rose-muted
    orbitLine: 'rgba(74, 26, 31, 0.55)',
  },
  light: {
    bgTop: '#FBF7EC',
    bgBottom: '#F0EAD8',
    panel: 'rgba(255, 255, 255, 0.92)',
    panelBorder: '#E3D9BE',           // --color-border
    gold: '#b9822f',
    goldSoft: '#a9772e',
    textPrimary: '#3A1015',           // --color-cream (light mode)
    textSecondary: '#8A6F63',         // --color-rose-muted (light mode)
    orbitLine: 'rgba(227, 217, 190, 0.7)',
  },
};

// Three-tier classification system (RESTRICTED removed — no longer exists on the backend)
const classificationColors = {
  PUBLIC: '#5fb8b0',       // teal — visible to all org members
  INTERNAL: '#c9974a',     // gold — same-domain users
  CONFIDENTIAL: '#a53d4c', // wine-red — uploader only
};

const statusColors = {
  ACTIVE: '#4caf7d',
  ARCHIVED: '#8a7566',
  PROCESSING: '#e0b876',
  DRAFT: '#7a9cc9',
};

const SolarSystem = () => {
  const { isDark } = useTheme();
  const THEME = isDark ? THEMES.dark : THEMES.light;

  const canvasRef = useRef(null);
  const [containerEl, setContainerEl] = useState(null);
  const containerRefCallback = useCallback((node) => {
    setContainerEl(node);
  }, []);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const animationRef = useRef(0);
  const canvasStateRef = useRef({
    width: 1200,
    height: 640,
    centerX: 600,
    centerY: 320,
    sunRadius: 36,
    time: 0,
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await getKnowledgeMapDocuments();
        setDocuments(response.documents || []);
        setStats(response.stats || null);
        setError(null);
      } catch (err) {
        console.error('Error fetching knowledge map documents:', err);
        setError(err?.message || 'Failed to load knowledge map');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  // Real measured size of the container, updated via ResizeObserver rather than
  // a one-shot read on mount (which can race with layout/fade-in animations and
  // measure 0 before the container has settled).
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerEl) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const width = Math.round(entry.contentRect.width);
      if (width <= 0) return; // ignore transient 0-width layout passes
      const height = Math.max(480, Math.min(640, width * 0.55));
      setCanvasSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    });

    observer.observe(containerEl);
    return () => observer.disconnect();
  }, [containerEl]);

  // Deterministic 0..1 value from a document's id, used to give each planet
  // its own starting angle instead of every ring's lone document sitting at
  // the same angle as every other ring.
  const hashSeed = (id) => {
    let h = 0;
    const s = String(id || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000;
    return h / 1000;
  };

  const getOrbitalPosition = (index, total, radius, time, orbitIndex, seed) => {
    // Inner orbits sweep faster than outer ones (loosely Kepler-like), and
    // each ring gets its own phase offset so rings don't all line up.
    const speed = 0.0022 - orbitIndex * 0.00035;
    const ringPhase = orbitIndex * (Math.PI / 2.7);
    const angle = (index / total) * Math.PI * 2 + ringPhase + seed * Math.PI * 2 + time * speed;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  };

  useEffect(() => {
    if (!canvasRef.current || documents.length === 0) return;
    if (canvasSize.width <= 0 || canvasSize.height <= 0) return; // wait for a real measurement

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Sync the actual <canvas> element and the mutable draw-loop state from
    // the measured size before starting the animation loop.
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    canvasStateRef.current.width = canvasSize.width;
    canvasStateRef.current.height = canvasSize.height;
    canvasStateRef.current.centerX = canvasSize.width / 2;
    canvasStateRef.current.centerY = canvasSize.height / 2;

    const draw = () => {
      const state = canvasStateRef.current;

      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, state.height);
      bgGradient.addColorStop(0, THEME.bgTop);
      bgGradient.addColorStop(1, THEME.bgBottom);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, state.width, state.height);

      // Soft nebula glow, off-center for depth
      const nebula = ctx.createRadialGradient(
        state.width * 0.72, state.height * 0.28, 0,
        state.width * 0.72, state.height * 0.28, Math.max(state.width, state.height) * 0.55
      );
      nebula.addColorStop(0, THEME.gold + '1a'); // ~10% alpha
      nebula.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, state.width, state.height);

      // Twinkling stars — fixed positions (seeded), pulsing opacity per star
      for (let i = 0; i < 110; i++) {
        const x = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % state.width;
        const y = Math.abs(Math.cos(i * 78.233) * 43758.5453) % state.height;
        const twinkle = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(state.time * 0.02 + i * 1.7));
        const size = i % 7 === 0 ? 1.8 : 1;
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = i % 5 === 0 ? THEME.goldSoft : THEME.textPrimary;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;

      // Occasional shooting star
      if (!state.meteor && state.time % 220 === 0 && Math.random() > 0.45) {
        const startX = Math.random() * state.width * 0.7 + state.width * 0.15;
        state.meteor = {
          startX, startY: -10,
          endX: startX - state.width * 0.22,
          endY: state.height * 0.5,
          startTime: state.time,
          duration: 45,
        };
      }
      if (state.meteor) {
        const t = (state.time - state.meteor.startTime) / state.meteor.duration;
        if (t <= 1) {
          const { startX, startY, endX, endY } = state.meteor;
          const hx = startX + (endX - startX) * t;
          const hy = startY + (endY - startY) * t;
          const tailT = Math.max(0, t - 0.18);
          const tx = startX + (endX - startX) * tailT;
          const ty = startY + (endY - startY) * tailT;
          const trail = ctx.createLinearGradient(tx, ty, hx, hy);
          trail.addColorStop(0, 'transparent');
          trail.addColorStop(1, THEME.goldSoft);
          ctx.strokeStyle = trail;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(hx, hy);
          ctx.stroke();
        } else {
          state.meteor = null;
        }
      }

      // Sun (organization center)
      const sunGradient = ctx.createRadialGradient(
        state.centerX, state.centerY, 4,
        state.centerX, state.centerY, state.sunRadius
      );
      sunGradient.addColorStop(0, THEME.goldSoft);
      sunGradient.addColorStop(1, THEME.gold);
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(state.centerX, state.centerY, state.sunRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(201, 151, 71, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(state.centerX, state.centerY, state.sunRadius + 14, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = THEME.textPrimary;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Org', state.centerX, state.centerY + 4);
      ctx.textAlign = 'left';

      // Orbits sized relative to canvas so it scales with the container
      const maxOrbit = Math.min(state.width, state.height) / 2 - 40;
      const orbits = [maxOrbit * 0.35, maxOrbit * 0.6, maxOrbit * 0.82, maxOrbit];
      let docIndex = 0;

      orbits.forEach((orbitRadius, orbitIndex) => {
        ctx.strokeStyle = THEME.orbitLine;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(state.centerX, state.centerY, orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        const docsPerOrbit = Math.ceil(documents.length / orbits.length);
        const orbitDocs = documents.slice(docIndex, docIndex + docsPerOrbit);

        orbitDocs.forEach((doc, idx) => {
          const seed = hashSeed(doc.id);
          const pos = getOrbitalPosition(idx, orbitDocs.length || 1, orbitRadius, state.time, orbitIndex, seed);
          const x = state.centerX + pos.x;
          const y = state.centerY + pos.y;
          const planetRadius = Math.max(7, Math.min(18, (doc.document_weight || 0.5) * 14));

          const classColor = classificationColors[doc.classification] || classificationColors.PUBLIC;
          const statusColor = statusColors[doc.status] || statusColors.ACTIVE;

          ctx.fillStyle = statusColor;
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(x, y, planetRadius + 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = 1;
          ctx.fillStyle = classColor;
          ctx.beginPath();
          ctx.arc(x, y, planetRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = statusColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, planetRadius + 3, 0, Math.PI * 2);
          ctx.stroke();

          if (selectedDoc?.id === doc.id) {
            ctx.strokeStyle = THEME.textPrimary;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y, planetRadius + 7, 0, Math.PI * 2);
            ctx.stroke();
          }

          doc.screenX = x;
          doc.screenY = y;
          doc.radius = planetRadius;
        });

        docIndex += docsPerOrbit;
      });

      state.time++;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [documents, selectedDoc, canvasSize, isDark]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const doc of documents) {
      const distance = Math.hypot(x - (doc.screenX || 0), y - (doc.screenY || 0));
      if (distance <= (doc.radius || 18) + 10) {
        setSelectedDoc((prev) => (prev?.id === doc.id ? null : doc));
        return;
      }
    }
    setSelectedDoc(null);
  };

  const panelStyle = {
    background: THEME.panel,
    border: `1px solid ${THEME.panelBorder}`,
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-10 text-center" style={{ ...panelStyle, color: THEME.textSecondary }}>
        Loading knowledge map…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-10 text-center" style={{ ...panelStyle, color: '#e07a7a' }}>
        Couldn't load the knowledge map: {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-2xl p-10 text-center" style={{ ...panelStyle, color: THEME.textSecondary }}>
        No documents to map yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div ref={containerRefCallback} className="flex-1 rounded-2xl overflow-hidden" style={panelStyle}>
        {stats && (
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-3 text-xs"
            style={{ borderBottom: `1px solid ${THEME.panelBorder}`, color: THEME.textSecondary }}
          >
            <span style={{ color: THEME.textPrimary }}>
              <strong>{stats.total}</strong> documents
            </span>
            {Object.entries(stats.by_classification || {}).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: classificationColors[k] || THEME.gold }}
                />
                {k}: {v}
              </span>
            ))}
          </div>
        )}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full cursor-pointer block"
        />
        <p className="text-xs px-5 py-3" style={{ color: THEME.textSecondary, borderTop: `1px solid ${THEME.panelBorder}` }}>
          Click any node to view document details
        </p>
      </div>

      {/* Side panel: legend + selected document, rendered as real DOM instead of canvas text for crispness/accessibility */}
      <div className="w-full xl:w-72 flex flex-col gap-4">
        <div className="rounded-2xl p-5" style={panelStyle}>
          <h3
            className="text-sm font-semibold mb-3"
            style={{ fontFamily: "'Playfair Display', serif", color: THEME.textPrimary }}
          >
            Classification
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(classificationColors).map(([key, color]) => (
              <div key={key} className="flex items-center gap-2 text-xs" style={{ color: THEME.textSecondary }}>
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </div>
            ))}
          </div>
        </div>

        {selectedDoc ? (
          <div className="rounded-2xl p-5" style={panelStyle}>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ fontFamily: "'Playfair Display', serif", color: THEME.textPrimary }}
            >
              Document Details
            </h3>
            <dl className="text-xs space-y-1.5" style={{ color: THEME.textSecondary }}>
              <div><span style={{ color: THEME.textPrimary }}>File:</span> {selectedDoc.filename}</div>
              <div><span style={{ color: THEME.textPrimary }}>Classification:</span> {selectedDoc.classification}</div>
              <div><span style={{ color: THEME.textPrimary }}>Status:</span> {selectedDoc.status}</div>
              <div><span style={{ color: THEME.textPrimary }}>Usage:</span> {selectedDoc.usage_tag}</div>
              <div><span style={{ color: THEME.textPrimary }}>Age:</span> {selectedDoc.age_tag}</div>
              <div><span style={{ color: THEME.textPrimary }}>Weight:</span> {Number(selectedDoc.document_weight || 0).toFixed(2)}</div>
            </dl>
          </div>
        ) : (
          <div className="rounded-2xl p-5 text-xs" style={{ ...panelStyle, color: THEME.textSecondary }}>
            Select a document node to see its details here.
          </div>
        )}
      </div>
    </div>
  );
};

export default SolarSystem;