// App.jsx — root component, handles top-level page routing

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Robots from './pages/Robots';
import Sensors from './pages/Sensors';

export default function App() {
  const [page, setPage] = useState('Dashboard');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar page={page} setPage={setPage} />
      {page === 'Dashboard' && <Dashboard />}
      {page === 'Robots'    && <Robots />}
      {page === 'Sensors'   && <Sensors />}
    </div>
  );
}
