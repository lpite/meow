// components/ui.jsx — shared reusable UI primitives

import React from 'react';

// ── Status badge ────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const cfg = {
    'In Progress': { bg: '#1a2a4a', color: '#60a5fa' },
    Complete:      { bg: '#0d2a1a', color: '#4ade80' },
    active:        { bg: '#0d2a1a', color: '#4ade80' },
    idle:          { bg: '#1e1e1e', color: '#94a3b8' },
    charging:      { bg: '#1a2a0a', color: '#a3e635' },
    offline:       { bg: '#2a1010', color: '#f87171' },
    warning:       { bg: '#2a1e00', color: '#fbbf24' },
  };
  const c = cfg[status] || cfg.idle;
  return (
    <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

// ── Battery indicator ────────────────────────────────────────────────────────
export function BatteryIcon({ level }) {
  const color = level > 60 ? '#4ade80' : level > 25 ? '#fbbf24' : '#f87171';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: color + '22', borderRadius: 4, padding: '2px 7px' }}>
      <div style={{ width: 14, height: 8, border: `1.5px solid ${color}`, borderRadius: 2, position: 'relative', display: 'flex', alignItems: 'center', padding: 1 }}>
        <div style={{ height: '100%', width: `${level}%`, background: color, borderRadius: 1, transition: 'width 0.3s' }} />
        <div style={{ width: 2, height: 4, background: color, borderRadius: '0 1px 1px 0', position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)' }} />
      </div>
      <span style={{ fontSize: 10, color, fontWeight: 600 }}>{level}%</span>
    </div>
  );
}

// ── Signal strength indicator ────────────────────────────────────────────────
export function SignalIcon({ strength }) {
  const color = strength > 60 ? '#4ade80' : strength > 25 ? '#fbbf24' : '#f87171';
  const bars = [25, 50, 75, 100];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
      {bars.map((threshold, i) => (
        <div key={i} style={{
          width: 4,
          height: `${(i + 1) * 3 + 2}px`,
          borderRadius: 1,
          background: strength >= threshold ? color : '#2a2a2a',
          transition: 'background 0.2s',
        }} />
      ))}
      <span style={{ fontSize: 10, color, fontWeight: 600, marginLeft: 4 }}>{strength}%</span>
    </div>
  );
}

// ── Stat card (number + label) ────────────────────────────────────────────────
export function MetricCard({ label, value, unit, accent }) {
  return (
    <div style={{ background: '#1a1a1e', borderRadius: 12, padding: '14px 16px', flex: 1, minWidth: 100 }}>
      <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 600, color: accent || '#ddd' }}>
        {value}<span style={{ fontSize: 13, fontWeight: 400, color: '#666', marginLeft: 3 }}>{unit}</span>
      </p>
    </div>
  );
}

// ── Back button ────────────────────────────────────────────────────────────
export function BackButton({ onClick, label = 'Back' }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent',
      border: '1px solid #2a2a2a',
      color: '#888',
      borderRadius: 8,
      padding: '6px 14px',
      fontSize: 13,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#ddd'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888'; }}
    >
      ← {label}
    </button>
  );
}

// ── Section card wrapper ─────────────────────────────────────────────────────
export function SectionCard({ title, children, style }) {
  return (
    <div style={{ background: '#161618', borderRadius: 16, padding: '20px', ...style }}>
      {title && <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{title}</p>}
      {children}
    </div>
  );
}

// ── Robot SVG illustration ────────────────────────────────────────────────────
export function RobotSVG({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="22" width="60" height="36" rx="8" fill="#2a2a2a"/>
      <rect x="12" y="26" width="52" height="28" rx="6" fill="#1e1e1e"/>
      <rect x="16" y="30" width="44" height="20" rx="4" fill="#252525"/>
      <circle cx="28" cy="40" r="5" fill="#333"/><circle cx="28" cy="40" r="3" fill="#1a1a1a"/>
      <circle cx="52" cy="40" r="5" fill="#333"/><circle cx="52" cy="40" r="3" fill="#1a1a1a"/>
      <rect x="35" y="36" width="10" height="8" rx="2" fill="#333"/>
      <rect x="20" y="56" width="16" height="8" rx="4" fill="#222"/>
      <circle cx="24" cy="64" r="4" fill="#333"/><circle cx="32" cy="64" r="4" fill="#333"/>
      <rect x="44" y="56" width="16" height="8" rx="4" fill="#222"/>
      <circle cx="48" cy="64" r="4" fill="#333"/><circle cx="56" cy="64" r="4" fill="#333"/>
      <rect x="6" y="30" width="4" height="12" rx="2" fill="#222"/>
      <rect x="70" y="30" width="4" height="12" rx="2" fill="#222"/>
      <rect x="36" y="14" width="8" height="10" rx="2" fill="#2a2a2a"/>
      <circle cx="40" cy="14" r="3" fill="#333"/>
    </svg>
  );
}

// ── Sensor SVG illustration ───────────────────────────────────────────────────
export function SensorSVG({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sg" x1="10" y1="25" x2="70" y2="63" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8e8e4"/><stop offset="1" stopColor="#c8c8c4"/>
        </linearGradient>
      </defs>
      <rect x="10" y="25" width="60" height="38" rx="6" fill="url(#sg)"/>
      <rect x="14" y="29" width="52" height="30" rx="4" fill="#e0e0dc"/>
      <rect x="18" y="33" width="44" height="22" rx="3" fill="#d0d0cc"/>
      <circle cx="18" cy="25" r="3" fill="#b0b0ac"/><circle cx="62" cy="25" r="3" fill="#b0b0ac"/>
      <circle cx="18" cy="63" r="3" fill="#b0b0ac"/><circle cx="62" cy="63" r="3" fill="#b0b0ac"/>
      <rect x="30" y="38" width="20" height="12" rx="2" fill="#c4c4c0"/>
      <rect x="32" y="40" width="16" height="8" rx="1" fill="#b8b8b4"/>
    </svg>
  );
}
