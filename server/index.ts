import { Hono } from "hono";
import { sensorApiRoutes } from "./routes/api/sensor";
import { dashboardApiRoutes } from "./routes/api/dashboard";
import { chartApiRoutes } from "./routes/api/chart";
import { activityApiRoutes } from "./routes/api/activity";
import { robotsApiRoutes } from "./routes/api/robots";
import { mockSensorsApiRoutes } from "./routes/api/sensors";
import { sensorAggregatesRoutes } from "./routes/api/sensorAggregates";
import { sensorTrend24hRoutes } from "./routes/api/sensorTrend24h";

import { serveStatic } from "hono/bun";

const app = new Hono();

const api = new Hono();
api.route("/sensor/", sensorApiRoutes);
api.route("/dashboard", dashboardApiRoutes);
api.route("/chart", chartApiRoutes);
api.route("/activity", activityApiRoutes);
api.route("/robots", robotsApiRoutes);
api.route("/sensors", mockSensorsApiRoutes);
api.route("/sensor/aggregates", sensorAggregatesRoutes);
api.route("/sensor/trend24h", sensorTrend24hRoutes);
app.route("/api/", api);
app.use("/static/*", serveStatic({ root: "./" }));

Bun.serve({
  fetch: app.fetch,
  port: 3000,
  hostname: "0.0.0.0",
});

console.log("Server running on http://0.0.0.0:3000");
