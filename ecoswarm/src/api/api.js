export const api = {
  getSensorAggregates: () =>
    fetch('http://localhost:3000/api/sensor/aggregates')
      .then(response => response.json()),

  getSensorTrend24h: async () => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const h = (new Date().getHours() - 23 + i + 24) % 24;
      return `${String(h).padStart(2, '0')}:00`;
    });
    const response = await fetch('http://localhost:3000/api/sensor/trend24h');
    const data = await response.json();
    return ({
      labels: hours,
      datasets: data.datasets || [],
    });
  },

  getRecentActivity: () =>
    fetch('http://localhost:3000/api/activity')
      .then(response => response.json()),

  getRobots: () =>
    fetch('http://localhost:3000/api/robots')
      .then(response => response.json()),

  getRobotById: (id) =>
    fetch(`http://localhost:3000/api/robots/${id}`)
      .then(response => response.json()),

  getSensors: () =>
    fetch('http://localhost:3000/api/sensors')
      .then(response => response.json()),

  getSensorById: (id) =>
    api.getSensors().then(sensors => sensors.find(s => s.id === parseInt(id))),
};
