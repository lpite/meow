// components/Charts.jsx

import React, { useEffect, useRef } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  DoughnutController,
  LineController,
  ArcElement,
  Filler,
  Tooltip,
} from 'chart.js';

Chart.register(
  CategoryScale, LinearScale,
  PointElement, LineElement,
  DoughnutController, LineController,
  ArcElement, Filler, Tooltip
);

// Always destroy any existing chart on a canvas before creating new — fixes "Canvas is already in use"
function safeCreate(canvas, config) {
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();
  return new Chart(canvas, config);
}

// ── Donut chart ────────────────────────────────────────────────────────────
export function DonutChart({ data, size = 120 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = safeCreate(canvasRef.current, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color),
          borderWidth: 0,
          hoverOffset: 0,
        }],
      },
      options: {
        responsive: false,
        cutout: '65%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { animateRotate: true, duration: 800 },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [data]);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} width={size} height={size} role="img" aria-label="Status donut chart" />
    </div>
  );
}

// ── Line chart ────────────────────────────────────────────────────────────
export function LineChart({ labels, values }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !labels || !values) return;
    chartRef.current = safeCreate(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96,165,250,0.08)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#60a5fa',
          tension: 0.3,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e1e22',
            titleColor: '#999',
            bodyColor: '#fff',
            borderColor: '#333',
            borderWidth: 1,
          },
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666', font: { size: 11 } } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [labels, values]);

  return (
    <div style={{ background: '#161618', borderRadius: 16, padding: '20px', marginTop: 16 }}>
      <p style={{ fontSize: 12, color: '#666', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Activity Overview
      </p>
      <div style={{ position: 'relative', height: 200 }}>
        <canvas ref={canvasRef} role="img" aria-label="Weekly activity line chart" />
      </div>
    </div>
  );
}

// ── Mini sparkline (for detail pages) ────────────────────────────────────────
export function SparkLine({ labels, values, color = '#60a5fa', height = 120 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !labels || !values) return;
    chartRef.current = safeCreate(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: color,
          backgroundColor: color + '18',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: color,
          tension: 0.3,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1e1e22', borderColor: '#333', borderWidth: 1 },
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#666', font: { size: 10 } } },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [labels, values, color]);

  return (
    <div style={{ position: 'relative', height }}>
      <canvas ref={canvasRef} role="img" aria-label="Readings sparkline" />
    </div>
  );
}
