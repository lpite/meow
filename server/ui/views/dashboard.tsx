import { Layout } from "../components/layout";
import { SensorCard } from "../components/sensor-card";

type DashboardPageProps = {
  sensors:any[];
}

export function DashboardPage({sensors}:DashboardPageProps){
  return (
    <Layout>
      <h1>Sensor Dashboard</h1>
      {sensors.map((sensor)=>(
        <SensorCard device_id={sensor.id} {...sensor} />))}
    </Layout>
  );
};