// pages/Sensors.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Chart, CategoryScale, LinearScale,
  PointElement, LineElement, LineController,
  Filler, Tooltip,
} from 'chart.js';
import { api } from '../api/mockApi';
import { StatusBadge, BatteryIcon, SignalIcon, BackButton, SensorSVG } from '../components/ui';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Filler, Tooltip);

function safeChart(canvas, config) {
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  return new Chart(canvas, config);
}

// ── Sensor card (grid) ────────────────────────────────────────────────────────
function SensorCard({ sensor, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(sensor)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#161618', borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
        border: `1px solid ${hovered ? '#2a2a2a' : 'transparent'}`,
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
    >
      <div style={{ background: '#1c1c20', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140, padding: 20 }}>
        <SensorSVG size={80} />
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#ddd' }}>{sensor.name}</span>
          <BatteryIcon level={sensor.battery} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: '#666' }}>{sensor.sector}</span>
          <StatusBadge status={sensor.status} />
        </div>
        {/* 2×2 readings grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {sensor.readings.map(r => (
            <div key={r.label} style={{ background: '#1c1c20', borderRadius: 8, padding: '7px 9px' }}>
              <p style={{ fontSize: 10, color: '#555', marginBottom: 2 }}>{r.label}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: r.color }}>
                {r.value}<span style={{ fontSize: 10, color: '#555', marginLeft: 2 }}>{r.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Multi-line trend chart ────────────────────────────────────────────────────
function TrendChart({ data, height = 240 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !data) return;
    const chart = safeChart(canvasRef.current, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: data.datasets.map((ds, i) => ({
          label: ds.label, data: ds.values,
          borderColor: ds.color, backgroundColor: ds.color + '10',
          borderWidth: 2, pointRadius: 0, pointHoverRadius: 4,
          tension: 0.4, fill: false,
          borderDash: i === 1 ? [4, 3] : i === 2 ? [2, 4] : i === 3 ? [6, 3] : [],
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
          x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#555', font: { size: 10 }, maxRotation: 0, maxTicksLimit: 8 } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#555', font: { size: 10 } } },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <div style={{ position: 'relative', height }}>
      <canvas ref={canvasRef} role="img" aria-label="Sensor readings trend" />
    </div>
  );
}

// ── Sensor detail page ────────────────────────────────────────────────────────
function SensorDetail({ sensor, onBack }) {
  const [period, setPeriod] = useState('24h');
  const trendData = period === '24h' ? sensor.trend24h : sensor.trend7d;

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <BackButton onClick={onBack} label="Sensors" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#1c1c20', borderRadius: 12, padding: 10 }}>
            <SensorSVG size={40} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{sensor.name}</h1>
              <span style={{ background: '#1e2a1a', color: '#a3e635', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>
                SHT31-D + MQ-135
              </span>
            </div>
            <span style={{ fontSize: 13, color: '#555' }}>Temperature · Humidity · CO₂ · VOC · {sensor.sector} · fw {sensor.firmwareVersion}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <SignalIcon strength={sensor.signalStrength} />
          <BatteryIcon level={sensor.battery} />
          <StatusBadge status={sensor.status} />
        </div>
      </div>

      {/* Current readings — 4 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        {sensor.readings.map(r => (
          <div key={r.label} style={{ background: '#161618', borderRadius: 16, padding: '18px 20px' }}>
            <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{r.label}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: r.color, lineHeight: 1 }}>{r.value}</span>
              <span style={{ fontSize: 13, color: '#555' }}>{r.unit}</span>
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.status === 'warning' ? '#fbbf24' : '#4ade80', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: r.status === 'warning' ? '#fbbf24' : '#4ade80' }}>
                {r.status === 'warning' ? 'Above threshold' : 'Normal range'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reading history — full width */}
      <div style={{ background: '#161618', borderRadius: 16, padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Reading History</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {trendData.datasets.map((ds, i) => (
                <div key={ds.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 18, height: 2, borderRadius: 1,
                    background: i === 0 ? ds.color : 'transparent',
                    borderTop: i === 1 ? `2px dashed ${ds.color}` : i === 2 ? `2px dotted ${ds.color}` : i === 3 ? `2px dashed ${ds.color}` : 'none',
                  }} />
                  <span style={{ fontSize: 11, color: '#666' }}>{ds.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', background: '#111', borderRadius: 8, padding: 3, gap: 2 }}>
            {['24h', '7d'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                background: period === p ? '#252528' : 'transparent',
                border: 'none', cursor: 'pointer',
                padding: '5px 14px', borderRadius: 6,
                fontSize: 12, fontWeight: period === p ? 600 : 400,
                color: period === p ? '#ddd' : '#555',
                transition: 'all 0.15s',
              }}>{p}</button>
            ))}
          </div>
        </div>
        <TrendChart data={trendData} height={280} />
      </div>

    </div>
  );
}

// ── Sensors list ──────────────────────────────────────────────────────────────
export default function Sensors() {
  const [sensors, setSensors]   = useState([]);
  const [filter, setFilter]     = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => { api.getSensors().then(setSensors); }, []);

  if (selected) return <SensorDetail sensor={selected} onBack={() => setSelected(null)} />;

  const filterOpts = ['all', 'Sector A', 'Sector B', 'Sector C'];
  const filtered = filter === 'all' ? sensors : sensors.filter(s => s.sector === filter);

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>
          Sensors <span style={{ color: '#555', fontWeight: 400, fontSize: 16 }}>({sensors.length})</span>
        </h1>
        <div style={{ display: 'flex', gap: 6 }}>
          {filterOpts.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? '#252528' : 'transparent',
              border: `1px solid ${filter === f ? '#444' : '#2a2a2a'}`,
              color: filter === f ? '#ddd' : '#666',
              borderRadius: 8, padding: '5px 12px', fontSize: 12,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{f === 'all' ? 'All' : f}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {filtered.map(s => <SensorCard key={s.id} sensor={s} onClick={setSelected} />)}
      </div>
    </div>
  );
}
