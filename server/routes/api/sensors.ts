import { Hono } from "hono";
import { db } from "../../utils/db";

export const mockSensorsApiRoutes = new Hono();

// Wave function for generating dynamic data
const wave = (base: number, amp: number, seed: number, len = 24) =>
  Array.from({ length: len }, (_, i) =>
    parseFloat((base + Math.sin((i + seed) / 3.5) * amp).toFixed(1)),
  );

// GET /api/mock/sensors - Get all sensors (mock data)
mockSensorsApiRoutes.get("/", async (c) => {
  const sensors = await db`
  SELECT 
    s.id,
    s.name,
    s.battery_level,
    s.firmware_version,
    s.status,
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

  const mock = Array.from({ length: 12 }, (_, i) => {
    const statuses = [
      "active",
      "active",
      "warning",
      "active",
      "active",
      "active",
      "offline",
      "active",
      "active",
      "warning",
      "active",
      "active",
    ];
    const batteries = [88, 92, 15, 76, 100, 63, 0, 95, 82, 22, 100, 77];
    const signals = [95, 88, 42, 91, 100, 78, 0, 97, 85, 31, 100, 93];

    const h24labels = Array.from({ length: 24 }, (_, j) => {
      const h = (new Date().getHours() - 23 + j + 24) % 24;
      return `${String(h).padStart(2, "0")}:00`;
    });
    const h7labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return {
      trend24h: {
        labels: h24labels,
        datasets: [
          {
            label: "Temperature (°C)",
            values: wave(20 + i * 0.3, 1.5, i),
            color: "#f87171",
          },
          {
            label: "Humidity (%)",
            values: wave(62 + i * 0.8, 3.5, i + 2),
            color: "#60a5fa",
          },
          {
            label: "CO₂ (ppm)",
            values: wave(390 + i * 5, 18, i + 4),
            color: "#a3e635",
          },
          {
            label: "VOC (mg/m³×10)",
            values: wave(1.2 + i * 0.3, 0.8, i + 6),
            color: "#fbbf24",
          },
        ],
      },
      trend7d: {
        labels: h7labels,
        datasets: [
          {
            label: "Temperature (°C)",
            values: wave(20 + i * 0.3, 1.2, i, 7),
            color: "#f87171",
          },
          {
            label: "Humidity (%)",
            values: wave(62 + i * 0.8, 3, i + 2, 7),
            color: "#60a5fa",
          },
          {
            label: "CO₂ (ppm)",
            values: wave(390 + i * 5, 15, i + 4, 7),
            color: "#a3e635",
          },
          {
            label: "VOC (mg/m³×10)",
            values: wave(1.2 + i * 0.3, 0.6, i + 6, 7),
            color: "#fbbf24",
          },
        ],
      },
    };
  });
  console.log(sensors)
  return c.json(
    sensors.map((el) => {
      console.log(el)
      const readings = JSON.parse(el.reading);
      return {
        ...el,
        installDate: el.created_at,
        firmwareVersion: el.firmware_version,
        battery: el.battery_level,
        sector: "Sector A",
        readings: [
          {
            label: "Temperature",
            value: readings.temperature,
            unit: "°C",
            color: "#f87171",
            status: "normal",
          },
          {
            label: "Humidity",
            value: readings.humidity,
            unit: "%",
            color: "#60a5fa",
            status: "normal",
          },
          {
            label: "CO₂",
            value: readings.air_quality,
            unit: "ppm",
            color: "#a3e635",
            status:"warning",
          },
        ],
        trend24h: {
          labels: [],
          datasets: [],
        },
        trend7d: {
          labels: [],
          datasets: [],
        },
      };
    }),
  );
});

// GET /api/mock/sensors/:id - Get sensor by ID (mock data)
mockSensorsApiRoutes.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const sensors = Array.from({ length: 12 }, (_, i) => {
    const statuses = [
      "active",
      "active",
      "warning",
      "active",
      "active",
      "active",
      "offline",
      "active",
      "active",
      "warning",
      "active",
      "active",
    ];
    const batteries = [88, 92, 15, 76, 100, 63, 0, 95, 82, 22, 100, 77];
    const signals = [95, 88, 42, 91, 100, 78, 0, 97, 85, 31, 100, 93];

    const h24labels = Array.from({ length: 24 }, (_, j) => {
      const h = (new Date().getHours() - 23 + j + 24) % 24;
      return `${String(h).padStart(2, "0")}:00`;
    });
    const h7labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return {
      id: i + 1,
      name: `Sensor ${i + 1}`,
      sector: `Sector ${["A", "B", "C", "A", "B", "C", "A", "B", "A", "C", "B", "A"][i]}`,
      status: statuses[i],
      battery: batteries[i],
      signalStrength: signals[i],
      installDate: "Jan 12, 2026",
      firmwareVersion: "1.8.3",

      // Every sensor has both modules
      readings: [
        {
          label: "Temperature",
          value: (20 + i * 0.3).toFixed(1),
          unit: "°C",
          color: "#f87171",
          status: i === 2 ? "warning" : "normal",
        },
        {
          label: "Humidity",
          value: (62 + i * 0.8).toFixed(1),
          unit: "%",
          color: "#60a5fa",
          status: "normal",
        },
        {
          label: "CO₂",
          value: String(390 + i * 5),
          unit: "ppm",
          color: "#a3e635",
          status: i === 9 ? "warning" : "normal",
        }
      ],

      trend24h: {
        labels: h24labels,
        datasets: [
          {
            label: "Temperature (°C)",
            values: wave(20 + i * 0.3, 1.5, i),
            color: "#f87171",
          },
          {
            label: "Humidity (%)",
            values: wave(62 + i * 0.8, 3.5, i + 2),
            color: "#60a5fa",
          },
          {
            label: "CO₂ (ppm)",
            values: wave(390 + i * 5, 18, i + 4),
            color: "#a3e635",
          },
          {
            label: "VOC (mg/m³×10)",
            values: wave(1.2 + i * 0.3, 0.8, i + 6),
            color: "#fbbf24",
          },
        ],
      },
      trend7d: {
        labels: h7labels,
        datasets: [
          {
            label: "Temperature (°C)",
            values: wave(20 + i * 0.3, 1.2, i, 7),
            color: "#f87171",
          },
          {
            label: "Humidity (%)",
            values: wave(62 + i * 0.8, 3, i + 2, 7),
            color: "#60a5fa",
          },
          {
            label: "CO₂ (ppm)",
            values: wave(390 + i * 5, 15, i + 4, 7),
            color: "#a3e635",
          },
          {
            label: "VOC (mg/m³×10)",
            values: wave(1.2 + i * 0.3, 0.6, i + 6, 7),
            color: "#fbbf24",
          },
        ],
      },
    };
  });

  const sensor = sensors.find((s) => s.id === id);
  if (!sensor) {
    return c.notFound();
  }
  return c.json(sensor);
});
