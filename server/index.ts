import { Hono } from "hono";
import { sensorApiRoutes } from "./routes/api/sensor";
import { views } from "./routes/views";
import { serveStatic } from "hono/bun";

const app = new Hono();

const api = new Hono();
api.route("/sensor/", sensorApiRoutes);

app.route("/api/", api);
app.route("", views);
app.use("/static/*", serveStatic({ root: "./" }));

export default app;
