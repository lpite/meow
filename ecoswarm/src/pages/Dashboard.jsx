// pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { api } from '../api/mockApi';
import { StatusBadge } from '../components/ui';
import { DonutChart, LineChart } from '../components/Charts';

function StatCard({ title, data, chartData }) {
  return (
    <div style={{
      background: '#161618', borderRadius: 16, padding: '20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      flex: 1, minWidth: 140,
    }}>
      <DonutChart data={chartData} size={110} />
      <div style={{ width: '100%' }}>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>
          {data.map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#999' }}>{d.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#ddd' }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
    api.getChartData().then(setChart);
    api.getRecentActivity().then(setActivity);
  }, []);

  if (!stats) return <div style={{ padding: 32, color: '#666', fontSize: 14 }}>Loading dashboard…</div>;

  const cards = [
    {
      title: 'Robots',
      data: [
        { label: 'Active', value: stats.robots.active, color: '#4ade80' },
        { label: 'Idle', value: stats.robots.idle, color: '#60a5fa' },
        { label: 'Charging', value: stats.robots.charging, color: '#a3e635' },
        { label: 'Offline', value: stats.robots.offline, color: '#f87171' },
      ],
      chartData: [
        { value: stats.robots.active, color: '#4ade80' },
        { value: stats.robots.idle, color: '#60a5fa' },
        { value: stats.robots.charging, color: '#a3e635' },
        { value: stats.robots.offline, color: '#2a2a2a' },
      ],
    },
    {
      title: 'Sensors',
      data: [
        { label: 'Active', value: stats.sensors.active, color: '#4ade80' },
        { label: 'Warn', value: stats.sensors.warning, color: '#fbbf24' },
        { label: 'Offline', value: stats.sensors.offline, color: '#f87171' },
      ],
      chartData: [
        { value: stats.sensors.active, color: '#4ade80' },
        { value: stats.sensors.warning, color: '#fbbf24' },
        { value: stats.sensors.offline, color: '#f87171' },
        { value: 2, color: '#2a2a2a' },
      ],
    },
    {
      title: 'Tasks',
      data: [
        { label: 'Done', value: stats.tasks.completed, color: '#4ade80' },
        { label: 'Active', value: stats.tasks.inProgress, color: '#60a5fa' },
        { label: 'Queued', value: stats.tasks.scheduled, color: '#94a3b8' },
      ],
      chartData: [
        { value: stats.tasks.completed, color: '#4ade80' },
        { value: stats.tasks.inProgress, color: '#60a5fa' },
        { value: stats.tasks.scheduled, color: '#94a3b8' },
      ],
    },
    {
      title: 'Coverage',
      data: [
        { label: 'Full', value: stats.coverage.covered, color: '#4ade80' },
        { label: 'Partial', value: stats.coverage.partial, color: '#60a5fa' },
        { label: 'None', value: stats.coverage.uncovered, color: '#2a2a2a' },
      ],
      chartData: [
        { value: stats.coverage.covered, color: '#4ade80' },
        { value: stats.coverage.partial, color: '#60a5fa' },
        { value: stats.coverage.uncovered, color: '#2a2a2a' },
      ],
    },
  ];

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto' }}>

      {/* Stat cards row */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {cards.map(c => <StatCard key={c.title} {...c} />)}
      </div>

      {/* Activity line chart */}
      {chart && <LineChart labels={chart.labels} values={chart.values} />}

      {/* Recent activity table */}
      <div style={{ background: '#161618', borderRadius: 16, padding: '20px', marginTop: 16 }}>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Recent Activity
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #222' }}>
              {['Manager', 'Date', 'Work time', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#555', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activity.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#252528', border: '1px solid #2e2e32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                    🤖
                  </div>
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
    </div>
  );
}
