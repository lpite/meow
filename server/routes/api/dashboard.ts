import { Hono } from "hono";

export const dashboardApiRoutes = new Hono();

dashboardApiRoutes.get("/stats", async (c) => {
  // Mock data from mockApi.js getDashboardStats
  const robotsC = await db`select count(id) as c from robots`.then(r=>r[0].c);

  const data = {
    robots: { active: robotsC, idle: 3, charging: 2, offline: 1 },
    sensors: { active: 22, warning: 4, offline: 2, total: 28 },
    tasks: { completed: 47, inProgress: 6, scheduled: 12, total: 65 },
    coverage: { covered: 73, partial: 15, uncovered: 12 },
  };
  return c.json(data);
});