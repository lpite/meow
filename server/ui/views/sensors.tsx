import { Layout } from "../components/layout";
import { SensorCard } from "../components/sensor-card";

type SensorsPageProps = {
  sensors: {
    id: string;
    name:string;
    reading: {
      temperature: number;
      air_quality: number;
      humidity: number;
      time: string;
      created_at: string;
    };
  }[];
};

export function SensorsPage({ sensors }: SensorsPageProps) {
  return (
    <Layout>
      <h1 class="text-white text-xl pb-2">Sensors</h1>
      <div class="grid grid-cols-4 gap-3 w-full">
        {sensors.map((sensor) => (
          <SensorCard
            name={sensor.name}
            id={sensor.id}
            air_quality={sensor.reading?.air_quality}
            temperature={sensor.reading?.temperature}
            humidity={sensor.reading?.humidity}
            created_at={sensor.reading?.created_at}
          />
        ))}
      </div>
    </Layout>
  );
}
