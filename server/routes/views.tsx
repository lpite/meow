import { Hono } from "hono";

import { DashboardPage } from "../ui/views/dashboard";
import { sensorWebRoutes } from "./web/sensor";
import { db } from "../utils/db";

export const views = new Hono();

views.get("/",async (c)=>{
	const sensors = await db`select s.id, s.name, json_group_array(json_object('temperature', sr.temperature,'humidity',sr.humidity,'air_quality',sr.air_quality,'created_at',sr.created_at)) as readings from sensors s left join sensor_readings sr on sr.device_id = s.id group by s.id, s.name;`

	return c.html(<DashboardPage sensors={sensors.map((el)=>({...el,readings:JSON.parse(el.readings)}))} />)
})

views.route("/sensor/",sensorWebRoutes);
