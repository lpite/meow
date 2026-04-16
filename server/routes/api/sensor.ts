import { Hono } from "hono";
import { db } from "../../utils/db";

export const sensorApiRoutes = new Hono();

sensorApiRoutes.get("/", async (c) => {
  const sensors = await db`
    select * from sensors;
  `;
  return c.json(sensors);
});

sensorApiRoutes.post("/", async (c) => {
  const json = await c.req.json();
  await db`
    INSERT INTO sensors (
        name
    )
    VALUES (
      ${json.name}
    )
  `;
  return c.json(json);
});

sensorApiRoutes.get("/:id/readings/latest", (c) => {
  return c.json([]);
});

sensorApiRoutes.post("/:id/readings", async (c) => {
  const deviceId = c.req.param("id");

  const sensor = await db`select * from sensors where id = ${deviceId}`;
  if (!sensor.length) {
    return c.notFound();
  }

  const json = await c.req.json();
  const { temperature, humidity, airQuality } = json;
  await db`
    INSERT INTO sensor_readings (
      device_id,
      temperature,
      humidity,
      air_quality
    )
    VALUES (
      ${deviceId},
      ${temperature},
      ${humidity},
      ${airQuality}
    )
  `;
  return c.json(json);
});

sensorApiRoutes.get("/:id/readings", async (c) => {
  const deviceId = c.req.param("id");

  const rows = await db`
    SELECT *
    FROM sensor_readings
    WHERE device_id = ${deviceId}
    ORDER BY created_at DESC
    LIMIT 100
  `;
  return c.json(rows);
});
