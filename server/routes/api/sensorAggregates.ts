import { Hono } from "hono";
import { db } from "../../utils/db";

export const sensorAggregatesRoutes = new Hono();

sensorAggregatesRoutes.get("/", async (c) => {
  const rows = await db`
        select 
        avg(humidity) as ah,
        avg(air_quality) as aaq,
        avg(temperature) as at,
        min(humidity) as minh,
        min(air_quality) as minaq,
        min(temperature) as mint,
        max(humidity) as maxh,
        max(air_quality) as maxaq,
        max(temperature) as maxt
        from sensor_readings`
  const sc =await db`select count(id) as c from sensors`;
  console.log(sc)
  const r = rows[0];

  const ventilationCount = await db`select count(id) as vc from ventilations;`.then(r=>r[0].vc);
  
  const data = {
    temperature: { avg: r.at, min: r.mint, max: r.maxt, unit: '°C', good: 3, warn: 1, count: sc[0].c },
    humidity: { avg: r.ah, min: r.minh, max: r.maxh, unit: '%', good: 3, warn: 0, count: sc[0].c },
    co2: { avg: Math.round(r.aaq), min: r.minaq, max: r.maxaq, unit: 'ppm', good: 1, warn: 1, count: sc[0].c },
    ventilation: { avg: 64, min: 20, max: 100, unit: '%', good: 8, warn: 2, count: ventilationCount },
  };
  return c.json(data);
});