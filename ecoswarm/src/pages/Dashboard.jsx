// pages/Dashboard.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Chart, CategoryScale, LinearScale,
  PointElement, LineElement, DoughnutController, LineController,
  ArcElement, Filler, Tooltip,
} from 'chart.js';
import { api } from '../api/api';
import { StatusBadge } from '../components/ui';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement,
  DoughnutController, LineController, ArcElement, Filler, Tooltip);

function safeChart(canvas, config) {
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  return new Chart(canvas, config);
}

// ── Donut stat card ────────────────────────────────────────────────────────
function SensorDonutCard({ label, icon, value, unit, sub, segments }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = safeChart(canvasRef.current, {
      type: 'doughnut',
      data: { datasets: [{ data: segments.map(s => s.value), backgroundColor: segments.map(s => s.color), borderWidth: 0, hoverOffset: 0 }] },
      options: {
        responsive: false, cutout: '68%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { animateRotate: true, duration: 900 },
      },
    });
    return () => chart.destroy();
  }, [segments]);

  return (
    <div style={{ background: '#161618', borderRadius: 16, padding: '20px', flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
          <canvas ref={canvasRef} width={90} height={90} role="img" aria-label={`${label} chart`} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: 9, color: '#555', marginTop: 2 }}>{unit}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {segments.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#888' }}>{s.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#ccc', marginLeft: 'auto', paddingLeft: 8 }}>{s.displayValue}</span>
            </div>
          ))}
        </div>
      </div>
      {sub && <p style={{ fontSize: 11, color: '#444', borderTop: '1px solid #1e1e22', paddingTop: 10 }}>{sub}</p>}
    </div>
  );
}

// ── 24h multi-line trend ──────────────────────────────────────────────────────
function TrendChart24h({ data }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !data) return;
    const sparseLabels = data.labels.map((l, i) => (i % 3 === 0 ? l : ''));
    const chart = safeChart(canvasRef.current, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((ds, i) => ({
          label: ds.label, data: ds.values,
          borderColor: ds.color, backgroundColor: ds.color + '10',
          borderWidth: 2, pointRadius: 0, pointHoverRadius: 4,
          tension: 0.4, fill: false,
          borderDash: i === 2 ? [4, 3] : i === 3 ? [2, 4] : [],
        })),
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1e1e22', titleColor: '#888', bodyColor: '#ddd', borderColor: '#333', borderWidth: 1, padding: 10 },
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#555', font: { size: 10 }, callback: (_, i) => sparseLabels[i], maxRotation: 0 } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#555', font: { size: 10 } } },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  if (!data) return null;
  return (
    <div style={{ background: '#161618', borderRadius: 16, padding: '20px', marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sensor Trend — Last 24 Hours</p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {data.datasets.map((ds, i) => (
            <div key={ds.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 18, height: 2, borderRadius: 1,
                background: [0, 1].includes(i) ? ds.color : 'transparent',
                borderTop: i === 2 ? `2px dashed ${ds.color}` : i === 3 ? `2px dotted ${ds.color}` : 'none',
              }} />
              <span style={{ fontSize: 11, color: '#666' }}>{ds.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', height: 220 }}>
        <canvas ref={canvasRef} role="img" aria-label="24h sensor trend" />
      </div>
    </div>
  );
}

// ── Recent activity ───────────────────────────────────────────────────────────
function ActivityTable({ rows }) {
  return (
    <div style={{ background: '#161618', borderRadius: 16, padding: '20px', marginTop: 16 }}>
      <p style={{ fontSize: 11, color: '#555', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Activity</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #222' }}>
            {['Manager','Date','Work time','Status'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
              <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#252528', border: '1px solid #2e2e32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🤖</div>
                <span style={{ fontSize: 13, color: '#ddd' }}>{r.name}</span>
              </td>
              <td style={{ padding: '12px', fontSize: 13, color: '#777' }}>{r.date}</td>
              <td style={{ padding: '12px', fontSize: 13, color: '#777', fontFamily: 'monospace' }}>{r.workTime}</td>
              <td style={{ padding: '12px' }}><StatusBadge status={r.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const [agg, setAgg]     = useState(null);
  const [trend, setTrend] = useState(null);
  const [activity, setAct] = useState([]);

  useEffect(() => {
    api.getSensorAggregates().then(setAgg);
    api.getSensorTrend24h().then(setTrend);
    api.getRecentActivity().then(setAct);
  }, []);

  if (!agg) return <div style={{ padding: 32, color: '#666', fontSize: 14 }}>Loading…</div>;

  const cards = [
    {
      label: 'Temperature', icon: '🌡️',
      value: agg.temperature.avg.toFixed(1), unit: agg.temperature.unit,
      sub: `${agg.temperature.count} sensors · ${agg.temperature.min}–${agg.temperature.max} ${agg.temperature.unit}`,
      segments: [
        { label: 'Normal',  color: '#4ade80', value: agg.temperature.good, displayValue: `${agg.temperature.good} ok` },
        { label: 'Warning', color: '#fbbf24', value: Math.max(agg.temperature.warn, 0.1), displayValue: `${agg.temperature.warn} warn` },
      ],
    },
    {
      label: 'Humidity', icon: '💧',
      value: agg.humidity.avg.toFixed(1), unit: agg.humidity.unit,
      sub: `${agg.humidity.count} sensors · ${agg.humidity.min}–${agg.humidity.max}${agg.humidity.unit}`,
      segments: [
        { label: 'Normal',  color: '#60a5fa', value: agg.humidity.good, displayValue: `${agg.humidity.good} ok` },
        { label: 'Warning', color: '#fbbf24', value: Math.max(agg.humidity.warn, 0.1), displayValue: `${agg.humidity.warn} warn` },
      ],
    },
    {
      label: 'CO₂ / VOC', icon: '🫧',
      value: agg.co2.avg, unit: agg.co2.unit,
      sub: `${agg.co2.count} sensors · ${agg.co2.min}–${agg.co2.max} ${agg.co2.unit}`,
      segments: [
        { label: 'Normal',  color: '#a3e635', value: agg.co2.good, displayValue: `${agg.co2.good} ok` },
        { label: 'Warning', color: '#fbbf24', value: Math.max(agg.co2.warn, 0.1), displayValue: `${agg.co2.warn} warn` },
      ],
    },
    {
      label: 'Ventilation', icon: '🌀',
      value: `${agg.ventilation.avg}%`, unit: 'avg',
      sub: `${agg.ventilation.count} fans · min ${agg.ventilation.min}% / max ${agg.ventilation.max}%`,
      segments: [
        { label: 'Normal',  color: '#c084fc', value: agg.ventilation.good, displayValue: `${agg.ventilation.good} ok` },
        { label: 'Warning', color: '#fbbf24', value: Math.max(agg.ventilation.warn, 0.1), displayValue: `${agg.ventilation.warn} warn` },
      ],
    },
  ];

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {cards.map(c => <SensorDonutCard key={c.label} {...c} />)}
      </div>
      <TrendChart24h data={trend} />
      <ActivityTable rows={activity} />
    </div>
  );
}
