// pages/Sensors.jsx  —  list + detail

import React, { useState, useEffect } from 'react';
import { api } from '../api/mockApi';
import { StatusBadge, BatteryIcon, SignalIcon, BackButton, MetricCard, SectionCard, SensorSVG } from '../components/ui';
import { SparkLine } from '../components/Charts';

// ── Sensor card (grid item) ─────────────────────────────────────────────────
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
        transition: 'transform 0.15s, box-shadow 0.15s',
        border: '1px solid ' + (hovered ? '#2a2a2a' : 'transparent'),
      }}
    >
      <div style={{ background: '#1c1c20', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, padding: 20 }}>
        <SensorSVG size={100} />
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#ddd' }}>{sensor.name}</span>
          <BatteryIcon level={sensor.battery} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#666' }}>{sensor.sector}</span>
          <span style={{ fontSize: 11, color: '#555', fontFamily: 'monospace' }}>{sensor.workTime}</span>
        </div>
      </div>
    </div>
  );
}

// ── Sensor detail page ──────────────────────────────────────────────────────
function SensorDetail({ sensor, onBack }) {
  return (
    <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <BackButton onClick={onBack} label="Sensors" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#1c1c20', borderRadius: 12, padding: 10 }}>
            <SensorSVG size={40} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{sensor.name}</h1>
            <span style={{ fontSize: 13, color: '#666' }}>{sensor.sector} · {sensor.type} · Firmware {sensor.firmwareVersion}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <BatteryIcon level={sensor.battery} />
          <StatusBadge status={sensor.status} />
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <MetricCard label="Last Reading" value={sensor.lastReading} accent="#4ade80" />
        <MetricCard label="Battery" value={sensor.battery} unit="%" accent="#60a5fa" />
        <MetricCard label="Signal" value={sensor.signalStrength} unit="%" accent="#a3e635" />
        <MetricCard label="Installed" value={sensor.installDate} accent="#94a3b8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Readings chart */}
        <SectionCard title="Reading History">
          <SparkLine
            labels={sensor.readingHistory.map(r => r.time)}
            values={sensor.readingHistory.map(r => parseFloat(r.value))}
            color="#4ade80"
            height={140}
          />
        </SectionCard>

        {/* Info */}
        <SectionCard title="Details">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {[
              ['Type', sensor.type],
              ['Sector', sensor.sector],
              ['Status', sensor.status],
              ['Battery', sensor.battery + '%'],
              ['Signal', sensor.signalStrength + '%'],
              ['Installed', sensor.installDate],
              ['Firmware', sensor.firmwareVersion],
            ].map(([k, v]) => (
              <tr key={k} style={{ borderBottom: '1px solid #1e1e22' }}>
                <td style={{ padding: '10px 0', fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', width: '40%' }}>{k}</td>
                <td style={{ padding: '10px 0', fontSize: 13, color: '#ccc' }}>{v}</td>
              </tr>
            ))}
          </table>
        </SectionCard>

        {/* Raw reading log */}
        <SectionCard title="Reading Log" style={{ gridColumn: '1 / -1' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Time', 'Value', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sensor.readingHistory.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '12px', fontSize: 13, color: '#777', fontFamily: 'monospace' }}>{r.time}</td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#ddd', fontFamily: 'monospace' }}>{r.value}</td>
                  <td style={{ padding: '12px' }}><StatusBadge status="active" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}

// ── Sensors page (router) ──────────────────────────────────────────────────
export default function Sensors() {
  const [sensors, setSensors] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => { api.getSensors().then(setSensors); }, []);

  if (selected) return <SensorDetail sensor={selected} onBack={() => setSelected(null)} />;

  const sectors = ['all', 'Sector A', 'Sector B', 'Sector C'];
  const filtered = filter === 'all' ? sensors : sensors.filter(s => s.sector === filter);

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>
          Sensors <span style={{ color: '#555', fontWeight: 400, fontSize: 16 }}>({sensors.length})</span>
        </h1>
        <div style={{ display: 'flex', gap: 6 }}>
          {sectors.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? '#252528' : 'transparent',
              border: `1px solid ${filter === s ? '#444' : '#2a2a2a'}`,
              color: filter === s ? '#ddd' : '#666',
              borderRadius: 8, padding: '5px 12px', fontSize: 12,
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {filtered.map(s => <SensorCard key={s.id} sensor={s} onClick={setSelected} />)}
      </div>
    </div>
  );
}
