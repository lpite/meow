// mockApi.js — swap these with real fetch() calls when your backend is ready
// Example: replace `Promise.resolve(data)` with `fetch('/api/robots').then(r => r.json())`

export const api = {
  getDashboardStats: () =>
    Promise.resolve({
      robots: { active: 8, idle: 3, charging: 2, offline: 1 },
      sensors: { active: 22, warning: 4, offline: 2, total: 28 },
      tasks: { completed: 47, inProgress: 6, scheduled: 12, total: 65 },
      coverage: { covered: 73, partial: 15, uncovered: 12 },
    }),

  getChartData: () =>
    Promise.resolve({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [42, 38, 55, 61, 48, 70, 52],
    }),

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
        workTime: '24:60:60',
        status: ['active','active','charging','active','idle','active','active','charging','active','active','idle','active'][i],
        battery: [92, 87, 45, 78, 100, 65, 88, 30, 95, 72, 100, 81][i],
        totalTasks: [134, 98, 210, 77, 155, 43, 189, 62, 201, 88, 117, 144][i],
        kmCovered: [312, 278, 445, 198, 367, 89, 423, 134, 501, 215, 289, 338][i],
        lastSeen: ['2 min ago','5 min ago','Charging','1 min ago','12 min ago','3 min ago','4 min ago','Charging','Just now','8 min ago','15 min ago','2 min ago'][i],
        firmwareVersion: '2.4.1',
        assignedSectors: [`Sector ${['A','B','C','A','B','C','A','B','A','C','B','A'][i]}`],
        taskHistory: [
          { date: 'Apr 17, 2026', task: 'Zone sweep', duration: '2:30:00', result: 'Complete' },
          { date: 'Apr 16, 2026', task: 'Perimeter scan', duration: '1:15:00', result: 'Complete' },
          { date: 'Apr 15, 2026', task: 'Deep clean', duration: '4:00:00', result: 'Complete' },
        ],
      }))
    ),

  getRobotById: (id) =>
    api.getRobots().then(robots => robots.find(r => r.id === parseInt(id))),

  getSensors: () =>
    Promise.resolve(
      Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Sensor ${i + 1}`,
        sector: `Sector ${['A','B','C','A','B','C','A','B','A','C','B','A'][i]}`,
        workTime: '24:60:60',
        status: ['active','active','warning','active','active','active','offline','active','active','warning','active','active'][i],
        battery: [88, 92, 15, 76, 100, 63, 0, 95, 82, 22, 100, 77][i],
        type: ['Temperature','Humidity','Motion','Temperature','CO2','Humidity','Motion','Temperature','CO2','Motion','Humidity','Temperature'][i],
        lastReading: ['22.4°C','68%','No motion','19.1°C','412ppm','72%','—','21.8°C','398ppm','Detected','65%','23.2°C'][i],
        signalStrength: [95, 88, 42, 91, 100, 78, 0, 97, 85, 31, 100, 93][i],
        installDate: 'Jan 12, 2026',
        firmwareVersion: '1.8.3',
        readingHistory: [
          { time: '14:00', value: '22.4' },
          { time: '13:00', value: '21.9' },
          { time: '12:00', value: '21.2' },
          { time: '11:00', value: '20.8' },
          { time: '10:00', value: '20.1' },
          { time: '09:00', value: '19.7' },
        ],
      }))
    ),

  getSensorById: (id) =>
    api.getSensors().then(sensors => sensors.find(s => s.id === parseInt(id))),
};
