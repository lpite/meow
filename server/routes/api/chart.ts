import { Hono } from "hono";

export const chartApiRoutes = new Hono();

chartApiRoutes.get("/", async (c) => {
  // Mock data from mockApi.js getChartData
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [42, 38, 55, 61, 48, 70, 52],
  };
  return c.json(data);
});