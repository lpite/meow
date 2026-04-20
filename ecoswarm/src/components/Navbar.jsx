// components/Navbar.jsx

import React from 'react';

export default function Navbar({ page, setPage }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center',
      padding: '0 32px', height: 64,
      background: '#0d0d0f', borderBottom: '1px solid #1e1e22',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <span style={{ fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: '-0.02em', marginRight: 'auto' }}>
        EcoSwarm
      </span>

      <div style={{ display: 'flex', gap: 4 }}>
        {['Dashboard', 'Robots', 'Sensors'].map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              background: page === p ? '#1e1e24' : 'transparent',
              border: 'none', cursor: 'pointer',
              padding: '8px 18px', borderRadius: 8,
              fontSize: 14, fontWeight: page === p ? 600 : 400,
              color: page === p ? '#fff' : '#666',
              transition: 'all 0.15s',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#1e1e24', border: '1px solid #333',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: '#888',
        }}>
          👤
        </div>
        <span style={{ fontSize: 13, color: '#888' }}>username</span>
      </div>
    </nav>
  );
}
