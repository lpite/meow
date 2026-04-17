import { Hono } from "hono";

import { DashboardPage } from "../ui/views/dashboard";
import { sensorWebRoutes } from "./web/sensor";
import { db } from "../utils/db";
import { SensorsPage } from "../ui/views/sensors";
import { RobotsPage } from "../ui/views/robots";
import { VentilationsPage } from "../ui/views/ventilations";

export const views = new Hono();

views.get("/", async (c) => {
  return c.html(<DashboardPage />);
});
views.get("/sensors", async (c) => {
  const sensors = await db`
  SELECT 
    s.id,
    s.name,
    json_object(
      'temperature', sr.temperature,
      'humidity', sr.humidity,
      'air_quality', sr.air_quality,
      'created_at', sr.created_at
    ) AS reading
  FROM sensors s
  LEFT JOIN sensor_readings sr
    ON sr.device_id = s.id
   AND sr.created_at = (
      SELECT MAX(created_at)
      FROM sensor_readings
      WHERE device_id = s.id
   );
`;
  return c.html(
    <SensorsPage
      sensors={sensors.map((el: any) => ({
        ...el,
        reading: JSON.parse(el.reading),
      }))}
    />,
  );
});

views.get("/robots", async (c) => {
  const robots = await db`select * from robots;`;

  return c.html(<RobotsPage robots={robots} />);
});

views.get("/ventilations", async (c) => {
  const ventilations = await db`select * from ventilations;`;

  return c.html(<VentilationsPage ventilations={ventilations} />);
});

views.route("/sensor/", sensorWebRoutes);
