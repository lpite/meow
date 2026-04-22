// components/Navbar.jsx

import React from 'react';
import { useRoute, Link } from 'wouter';

const routes = [
  { name: 'Dashboard', path: '/' },
  { name: 'Robots', path: '/robots' },
  { name: 'Sensors', path: '/sensors' },
];

export default function Navbar() {
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
        {routes.map(({ name, path }) => (
          <NavbarLink key={path} name={name} path={path} />
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

function NavbarLink({ name, path }) {
  const [isActive] = useRoute(path);
  return (
    <Link href={path}>
      <a style={{
        background: isActive ? '#1e1e24' : 'transparent',
        border: 'none', cursor: 'pointer',
        padding: '8px 18px', borderRadius: 8,
        fontSize: 14, fontWeight: isActive ? 600 : 400,
        color: isActive ? '#fff' : '#666',
        transition: 'all 0.15s',
        textDecoration: 'none',
      }}>
        {name}
      </a>
    </Link>
  );
}