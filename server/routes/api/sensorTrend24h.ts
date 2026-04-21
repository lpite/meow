import { Hono } from "hono";
import { db } from "../../utils/db";

export const sensorTrend24hRoutes = new Hono();

sensorTrend24hRoutes.get("/", async (c) => {
  const rows = await db`select avg(humidity) as h,avg(air_quality) as aq,avg(temperature) as t, STRFTIME('%H',created_at) as hour from sensor_readings group by hour`
  const hours = rows.map(el=>`${el.hour}:00`);
  const t = rows.map(el=>Math.round(Number(el.t)));
  const h = rows.map(el=>Math.round(Number(el.h)));
  const aq = rows.map(el=>Math.round(Number(el.aq))); 

  const data = {
    labels: hours,
    datasets: [
      { label: 'Temperature (°C)', values: t, color: '#f87171' },
      { label: 'Humidity (%)',      values: h, color: '#60a5fa' },
      { label: 'CO₂ (ppm ×0.1)',   values: aq, color: '#a3e635' },
      // { label: 'Ventilation (%)',   values: wave(64,   18,  6), color: '#c084fc' },
    ],
  };
  return c.json(data);
});