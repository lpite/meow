import { Hono } from "hono";
import { db } from "../../utils/db";

export const robotsApiRoutes = new Hono();

// Wave function for activity7d values
const wave = (base, amp, seed, len = 7) =>
  Array.from({ length: len }, (_, i) =>
    Math.max(0, Math.round(base + Math.sin((i + seed) / 3.5) * amp)),
  );

// GET /api/robots - Get all robots
robotsApiRoutes.get("/", async (c) => {
  const robots = await db`select * from robots`;

  // const robots = Array.from({ length: 12 }, (_, i) => ({
  //   id: i + 1,
  //   name: `Robot ${i + 1}`,
  //   sector: `Sector ${['A','B','C','A','B','C','A','B','A','C','B','A'][i]}`,
  //   workTime: ['24:30:10','18:45:00','12:00:00','22:10:30','08:55:20','16:40:00','20:15:45','14:30:00','23:50:10','10:05:30','19:20:00','17:35:45'][i],
  //   status: ['active','active','charging','active','idle','active','active','charging','active','active','idle','active'][i],
  //   battery: [92, 87, 45, 78, 100, 65, 88, 30, 95, 72, 100, 81][i],
  //   totalTasks: [134, 98, 210, 77, 155, 43, 189, 62, 201, 88, 117, 144][i],
  //   kmCovered: [312, 278, 445, 198, 367, 89, 423, 134, 501, 215, 289, 338][i],
  //   lastSeen: ['2 min ago','5 min ago','Charging','1 min ago','12 min ago','3 min ago','4 min ago','Charging','Just now','8 min ago','15 min ago','2 min ago'][i],
  //   firmwareVersion: '0.0.1',
  //   taskHistory: [
  //     { date: 'Apr 17, 2026', task: 'Zone sweep', duration: '2:30:00', result: 'Complete' },
  //     { date: 'Apr 16, 2026', task: 'Perimeter scan', duration: '1:15:00', result: 'Complete' },
  //     { date: 'Apr 15, 2026', task: 'Deep clean', duration: '4:00:00', result: 'Complete' },
  //     { date: 'Apr 14, 2026', task: 'Zone sweep', duration: '2:45:00', result: 'Complete' },
  //     { date: 'Apr 13, 2026', task: 'Mapping run', duration: '3:10:00', result: 'Complete' },
  //   ],
  //   activity7d: {
  //     labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  //     values: wave(5, 2.5, i, 7),
  //   },
  // }));
  return c.json(
    robots.map((r,i) => ({
      ...r,
      sector: `Sector A`,
      workTime: ["24:30:10"],
      totalTasks: r.total_tasks,
      kmCovered: r.meters_covered / 1000,
      lastSeen: "2 min ago",
      firmwareVersion: r.firmware_version,
      taskHistory: [
        {
          date: "Apr 17, 2026",
          task: "Zone sweep",
          duration: "2:30:00",
          result: "Complete",
        },
        {
          date: "Apr 16, 2026",
          task: "Perimeter scan",
          duration: "1:15:00",
          result: "Complete",
        },
        {
          date: "Apr 15, 2026",
          task: "Deep clean",
          duration: "4:00:00",
          result: "Complete",
        },
        {
          date: "Apr 14, 2026",
          task: "Zone sweep",
          duration: "2:45:00",
          result: "Complete",
        },
        {
          date: "Apr 13, 2026",
          task: "Mapping run",
          duration: "3:10:00",
          result: "Complete",
        },
      ],
      activity7d: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: wave(5, 2.5, i, 7),
      },
    })),
  );
});

// GET /api/robots/:id - Get robot by ID
robotsApiRoutes.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const robots = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Robot ${i + 1}`,
    sector: `Sector ${["A", "B", "C", "A", "B", "C", "A", "B", "A", "C", "B", "A"][i]}`,
    workTime: [
      "24:30:10",
      "18:45:00",
      "12:00:00",
      "22:10:30",
      "08:55:20",
      "16:40:00",
      "20:15:45",
      "14:30:00",
      "23:50:10",
      "10:05:30",
      "19:20:00",
      "17:35:45",
    ][i],
    status: [
      "active",
      "active",
      "charging",
      "active",
      "idle",
      "active",
      "active",
      "charging",
      "active",
      "active",
      "idle",
      "active",
    ][i],
    battery: [92, 87, 45, 78, 100, 65, 88, 30, 95, 72, 100, 81][i],
    totalTasks: [134, 98, 210, 77, 155, 43, 189, 62, 201, 88, 117, 144][i],
    kmCovered: [312, 278, 445, 198, 367, 89, 423, 134, 501, 215, 289, 338][i],
    lastSeen: [
      "2 min ago",
      "5 min ago",
      "Charging",
      "1 min ago",
      "12 min ago",
      "3 min ago",
      "4 min ago",
      "Charging",
      "Just now",
      "8 min ago",
      "15 min ago",
      "2 min ago",
    ][i],
    firmwareVersion: "2.4.1",
    taskHistory: [
      {
        date: "Apr 17, 2026",
        task: "Zone sweep",
        duration: "2:30:00",
        result: "Complete",
      },
      {
        date: "Apr 16, 2026",
        task: "Perimeter scan",
        duration: "1:15:00",
        result: "Complete",
      },
      {
        date: "Apr 15, 2026",
        task: "Deep clean",
        duration: "4:00:00",
        result: "Complete",
      },
      {
        date: "Apr 14, 2026",
        task: "Zone sweep",
        duration: "2:45:00",
        result: "Complete",
      },
      {
        date: "Apr 13, 2026",
        task: "Mapping run",
        duration: "3:10:00",
        result: "Complete",
      },
    ],
    activity7d: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: wave(5, 2.5, i, 7),
    },
  }));

  const robot = robots.find((r) => r.id === id);
  if (!robot) {
    return c.notFound();
  }
  return c.json(robot);
});
