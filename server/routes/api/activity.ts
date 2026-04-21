import { Hono } from "hono";
import { db } from "../../utils/db";

export const activityApiRoutes = new Hono();

// Helper to convert decimal hours (e.g., 2.5) to "HH:MM:SS" (e.g., "02:30:00")
const formatDecimalHours = (decimalHours: number): string => {
  const h = Math.floor(decimalHours);
  const m = Math.floor((decimalHours - h) * 60);
  const s = Math.floor((((decimalHours - h) * 60) - m) * 60);

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

activityApiRoutes.get("/", async (c) => {
  try {
    const robots = await db`
      SELECT 
        r.id, 
        r.name, 
        rt.start_time as date, 
        rt.end_time,
        rt.status,
        CASE 
          WHEN rt.end_time IS NULL THEN (julianday('now') - julianday(rt.start_time)) * 24
          ELSE (julianday(rt.end_time) - julianday(rt.start_time)) * 24
        END as hours
      FROM robots r
      INNER JOIN robot_tasks rt ON r.id = rt.robot_id
    `;
    
    // Optional: Keep for debugging, but consider removing in production
    // console.log("robots:", JSON.stringify(robots));
    
    const data = robots.map((r: any) => ({
      id: r.id,
      name: r.name,
      date: r.date,
      workTime: formatDecimalHours(Number(r.hours)),
      status: r.status
    }));
    
    return c.json(data);
  } catch (error) {
    console.error("Failed to fetch robot activity:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});