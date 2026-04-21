import { Hono } from "hono";

export const activityApiRoutes = new Hono();

activityApiRoutes.get("/", async (c) => {
  // Mock data from mockApi.js getRecentActivity

  const data = [
    { id: 1, name: 'Robot 1', date: 'Jun 24, 2026', workTime: '24:60:60', status: 'In Progress' },
    { id: 2, name: 'Robot 2', date: 'Mar 10, 2026', workTime: '24:60:60', status: 'Complete' },
    { id: 3, name: 'Robot 3', date: 'Apr 15, 2026', workTime: '18:30:00', status: 'Complete' },
    { id: 4, name: 'Robot 4', date: 'Apr 17, 2026', workTime: '06:12:30', status: 'In Progress' },
  ];
  return c.json(data);
});