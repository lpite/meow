import { Hono } from "hono";
import { db } from "../../utils/db";
import { SensorCard } from "../../ui/components/sensor-card";

export const sensorWebRoutes = new Hono();

sensorWebRoutes.get("/:id/readings/latest", async (c) => {
  const deviceId = c.req.param("id");

  const rows = await db`
  SELECT 
    s.id,
    s.name,
    sr.temperature,
    sr.humidity,
    sr.air_quality,
    sr.created_at
  FROM sensors s
  LEFT JOIN sensor_readings sr
    ON sr.device_id = s.id
   AND sr.created_at = (
      SELECT created_at
      FROM sensor_readings
      WHERE device_id = s.id
      order by created_at desc
      LIMIT 1
   )
  where s.id = ${deviceId};
`;
  const sensor = rows[0];
  return c.html(<SensorCard {...sensor} />);
});

sensorWebRoutes.get("/:id/readings", async (c) => {
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
