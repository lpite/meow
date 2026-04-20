// mockApi.js — swap these with real fetch() calls when your backend is ready

const wave = (base, amp, seed, len = 24) =>
  Array.from({ length: len }, (_, i) =>
    parseFloat((base + Math.sin((i + seed) / 3.5) * amp).toFixed(1))
  );

export const api = {
  getSensorAggregates: () =>
    Promise.resolve({
      temperature: { avg: 21.8, min: 18.2, max: 24.6, unit: '°C',  good: 3, warn: 1, count: 4 },
      humidity:    { avg: 68.3, min: 63.0, max: 74.0, unit: '%',    good: 3, warn: 0, count: 3 },
      co2:         { avg: 403,  min: 385,  max: 430,  unit: 'ppm',  good: 1, warn: 1, count: 2 },
      ventilation: { avg: 64,   min: 20,   max: 100,  unit: '%',    good: 8, warn: 2, count: 10 },
    }),

  getSensorTrend24h: () => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const h = (new Date().getHours() - 23 + i + 24) % 24;
      return `${String(h).padStart(2, '0')}:00`;
    });
    return Promise.resolve({
      labels: hours,
      datasets: [
        { label: 'Temperature (°C)', values: wave(21.5, 1.8, 0), color: '#f87171' },
        { label: 'Humidity (%)',      values: wave(67,   4,   2), color: '#60a5fa' },
        { label: 'CO₂ (ppm ×0.1)',   values: wave(40.3, 2.5, 4), color: '#a3e635' },
        { label: 'Ventilation (%)',   values: wave(64,   18,  6), color: '#c084fc' },
      ],
    });
  },

  getRecentActivity: () =>
    Promise.resolve([
      { id: 1, name: 'Robot 1', date: 'Jun 24, 2026', workTime: '24:60:60', status: 'In Progress' },
      { id: 2, name: 'Robot 2', date: 'Mar 10, 2026', workTime: '24:60:60', status: 'Complete' },
      { id: 3, name: 'Robot 3', date: 'Apr 15, 2026', workTime: '18:30:00', status: 'Complete' },
      { id: 4, name: 'Robot 4', date: 'Apr 17, 2026', workTime: '06:12:30', status: 'In Progress' },
    ]),

  getRobots: () =>
    Promise.resolve(
      Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Robot ${i + 1}`,
        sector: `Sector ${['A','B','C','A','B','C','A','B','A','C','B','A'][i]}`,
        workTime: ['24:30:10','18:45:00','12:00:00','22:10:30','08:55:20','16:40:00','20:15:45','14:30:00','23:50:10','10:05:30','19:20:00','17:35:45'][i],
        status: ['active','active','charging','active','idle','active','active','charging','active','active','idle','active'][i],
        battery: [92, 87, 45, 78, 100, 65, 88, 30, 95, 72, 100, 81][i],
        totalTasks: [134, 98, 210, 77, 155, 43, 189, 62, 201, 88, 117, 144][i],
        kmCovered: [312, 278, 445, 198, 367, 89, 423, 134, 501, 215, 289, 338][i],
        lastSeen: ['2 min ago','5 min ago','Charging','1 min ago','12 min ago','3 min ago','4 min ago','Charging','Just now','8 min ago','15 min ago','2 min ago'][i],
        firmwareVersion: '2.4.1',
        taskHistory: [
          { date: 'Apr 17, 2026', task: 'Zone sweep',     duration: '2:30:00', result: 'Complete' },
          { date: 'Apr 16, 2026', task: 'Perimeter scan', duration: '1:15:00', result: 'Complete' },
          { date: 'Apr 15, 2026', task: 'Deep clean',     duration: '4:00:00', result: 'Complete' },
          { date: 'Apr 14, 2026', task: 'Zone sweep',     duration: '2:45:00', result: 'Complete' },
          { date: 'Apr 13, 2026', task: 'Mapping run',    duration: '3:10:00', result: 'Complete' },
        ],
        activity7d: {
          labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
          values: wave(5, 2.5, i, 7).map(v => Math.max(0, Math.round(v))),
        },
      }))
    ),

  getRobotById: (id) =>
    api.getRobots().then(robots => robots.find(r => r.id === parseInt(id))),

  getSensors: () =>
    Promise.resolve(
      Array.from({ length: 12 }, (_, i) => {
        const statuses  = ['active','active','warning','active','active','active','offline','active','active','warning','active','active'];
        const batteries = [88, 92, 15, 76, 100, 63, 0, 95, 82, 22, 100, 77];
        const signals   = [95, 88, 42, 91, 100, 78, 0, 97, 85, 31, 100, 93];

        const h24labels = Array.from({ length: 24 }, (_, j) => {
          const h = (new Date().getHours() - 23 + j + 24) % 24;
          return `${String(h).padStart(2, '0')}:00`;
        });
        const h7labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

        return {
          id: i + 1,
          name: `Sensor ${i + 1}`,
          sector: `Sector ${['A','B','C','A','B','C','A','B','A','C','B','A'][i]}`,
          status: statuses[i],
          battery: batteries[i],
          signalStrength: signals[i],
          installDate: 'Jan 12, 2026',
          firmwareVersion: '1.8.3',

          // Every sensor has both modules
          readings: [
            { label: 'Temperature', value: (20 + (i * 0.3)).toFixed(1), unit: '°C',    color: '#f87171', status: i === 2 ? 'warning' : 'normal' },
            { label: 'Humidity',    value: (62 + (i * 0.8)).toFixed(1), unit: '%',     color: '#60a5fa', status: 'normal' },
            { label: 'CO₂',        value: String(390 + i * 5),          unit: 'ppm',   color: '#a3e635', status: i === 9 ? 'warning' : 'normal' },
            { label: 'VOC',        value: (0.12 + i * 0.03).toFixed(2), unit: 'mg/m³', color: '#fbbf24', status: i === 9 ? 'warning' : 'normal' },
          ],

          trend24h: {
            labels: h24labels,
            datasets: [
              { label: 'Temperature (°C)', values: wave(20 + i * 0.3, 1.5, i),     color: '#f87171' },
              { label: 'Humidity (%)',      values: wave(62 + i * 0.8, 3.5, i + 2), color: '#60a5fa' },
              { label: 'CO₂ (ppm)',         values: wave(390 + i * 5, 18,  i + 4),  color: '#a3e635' },
              { label: 'VOC (mg/m³×10)',    values: wave(1.2 + i * 0.3, 0.8, i + 6), color: '#fbbf24' },
            ],
          },
          trend7d: {
            labels: h7labels,
            datasets: [
              { label: 'Temperature (°C)', values: wave(20 + i * 0.3, 1.2, i,     7), color: '#f87171' },
              { label: 'Humidity (%)',      values: wave(62 + i * 0.8, 3,   i + 2, 7), color: '#60a5fa' },
              { label: 'CO₂ (ppm)',         values: wave(390 + i * 5, 15,  i + 4, 7), color: '#a3e635' },
              { label: 'VOC (mg/m³×10)',    values: wave(1.2 + i * 0.3, 0.6, i + 6, 7), color: '#fbbf24' },
            ],
          },
        };
      })
    ),

  getSensorById: (id) =>
    api.getSensors().then(sensors => sensors.find(s => s.id === parseInt(id))),
};
