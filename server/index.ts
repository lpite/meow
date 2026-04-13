import { Hono } from 'hono'
import { sensorApiRoutes } from './routes/api/sensor';
import { views } from './routes/views';

const app = new Hono()

const api = new Hono();
api.route("/sensor/",sensorApiRoutes);


app.route("/api/",api);
app.route("",views);


export default app