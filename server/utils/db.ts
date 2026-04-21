import { SQL } from "bun";

export const db = new SQL("sqlite://../shittyyyyy.db");

await db`
  CREATE TABLE IF NOT EXISTS sensors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    status text DEFAULT 'offline',
    battery_level integer DEFAULT 0,
    firmware_version text DEFAULT '0.0.1'
  )
`;

await db`
  CREATE TABLE IF NOT EXISTS sensor_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    air_quality INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;

await db`
  CREATE TABLE IF NOT EXISTS robots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'offline',
  battery_level INTEGER DEFAULT 0,
  meters_covered integer DEFAULT 0,
  firmware_version text DEFAULT '0.0.1',
  total_tasks integer DEFAULT 0
  )
`;

await db`
  CREATE TABLE IF NOT EXISTS robot_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  robot_id integer REFERENCES robots(id),
  start_time TEXT DEFAULT CURRENT_TIMESTAMP,
  end_time TEXT,
  status TEXT DEFAULT 'In Progress'
  )
`;

await db`
  CREATE TABLE IF NOT EXISTS ventilations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;
