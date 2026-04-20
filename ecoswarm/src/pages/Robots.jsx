// pages/Robots.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Chart, CategoryScale, LinearScale,
  BarElement, BarController, Tooltip,
} from 'chart.js';
import { api } from '../api/mockApi';
import { StatusBadge, BatteryIcon, BackButton, MetricCard, RobotSVG } from '../components/ui';

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip);

function safeChart(canvas, config) {
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  return new Chart(canvas, config);
}

// ── Robot card ────────────────────────────────────────────────────────────────
function RobotCard({ robot, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(robot)}
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
      <div style={{ background: '#1c1c20', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, padding: 20 }}>
        <RobotSVG size={100} />
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#ddd' }}>{robot.name}</span>
          <BatteryIcon level={robot.battery} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#666' }}>{robot.sector}</span>
          <span style={{ fontSize: 11, color: '#555', fontFamily: 'monospace' }}>{robot.workTime}</span>
        </div>
      </div>
    </div>
  );
}

// ── Weekly activity bar chart ─────────────────────────────────────────────────
function ActivityBarChart({ data }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current || !data) return;
    const chart = safeChart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: data.values.map((_, i) =>
            i === data.labels.length - 1 ? '#60a5fa' : '#252530'
          ),
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1e1e22', titleColor: '#888', bodyColor: '#ddd', borderColor: '#333', borderWidth: 1 },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#555', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#555', font: { size: 10 }, stepSize: 1 }, beginAtZero: true },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <div style={{ position: 'relative', height: 200 }}>
      <canvas ref={canvasRef} role="img" aria-label="Weekly task activity" />
    </div>
  );
}

// ── Robot detail ──────────────────────────────────────────────────────────────
function RobotDetail({ robot, onBack }) {
  return (
    <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <BackButton onClick={onBack} label="Robots" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#1c1c20', borderRadius: 12, padding: 10 }}>
            <RobotSVG size={40} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{robot.name}</h1>
            <span style={{ fontSize: 13, color: '#555' }}>{robot.sector} · Firmware {robot.firmwareVersion}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <BatteryIcon level={robot.battery} />
          <StatusBadge status={robot.status} />
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <MetricCard label="Total Tasks"  value={robot.totalTasks} accent="#4ade80" />
        <MetricCard label="KM Covered"   value={robot.kmCovered}  unit="km" accent="#60a5fa" />
        <MetricCard label="Work Time"    value={robot.workTime}   accent="#a3e635" />
        <MetricCard label="Last Seen"    value={robot.lastSeen}   accent="#94a3b8" />
      </div>

      {/* Weekly activity — full width */}
      <div style={{ background: '#161618', borderRadius: 16, padding: '20px', marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
          Weekly Activity <span style={{ color: '#333', fontWeight: 400 }}>— tasks completed per day</span>
        </p>
        <ActivityBarChart data={robot.activity7d} />
      </div>

      {/* Task history — full width */}
      <div style={{ background: '#161618', borderRadius: 16, padding: '20px' }}>
        <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Task History</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #222' }}>
              {['Date', 'Task', 'Duration', 'Result'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {robot.taskHistory.map((t, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '12px', fontSize: 13, color: '#777' }}>{t.date}</td>
                <td style={{ padding: '12px', fontSize: 13, color: '#ddd' }}>{t.task}</td>
                <td style={{ padding: '12px', fontSize: 13, color: '#777', fontFamily: 'monospace' }}>{t.duration}</td>
                <td style={{ padding: '12px' }}><StatusBadge status={t.result} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ── Robots list ───────────────────────────────────────────────────────────────
export default function Robots() {
  const [robots, setRobots]     = useState([]);
  const [filter, setFilter]     = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => { api.getRobots().then(setRobots); }, []);

  if (selected) return <RobotDetail robot={selected} onBack={() => setSelected(null)} />;

  const sectors = ['all', 'Sector A', 'Sector B', 'Sector C'];
  const filtered = filter === 'all' ? robots : robots.filter(r => r.sector === filter);

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>
          Robots <span style={{ color: '#555', fontWeight: 400, fontSize: 16 }}>({robots.length})</span>
        </h1>
        <div style={{ display: 'flex', gap: 6 }}>
          {sectors.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? '#252528' : 'transparent',
              border: `1px solid ${filter === s ? '#444' : '#2a2a2a'}`,
              color: filter === s ? '#ddd' : '#666',
              borderRadius: 8, padding: '5px 12px', fontSize: 12,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{s === 'all' ? 'All' : s}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {filtered.map(r => <RobotCard key={r.id} robot={r} onClick={setSelected} />)}
      </div>
    </div>
  );
}
