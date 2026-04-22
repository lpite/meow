// App.jsx — root component, handles top-level page routing

import { Route, Switch } from 'wouter';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Robots from './pages/Robots';
import Sensors from './pages/Sensors';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/robots" component={Robots} />
        <Route path="/sensors" component={Sensors} />
      </Switch>
    </div>
  );
}