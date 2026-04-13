type SensorCardProps = {
  device_id: string;
  temperature: number;
  humidity: number;
  air_quality: number;
  created_at: string;
};
export function SensorCard({
	device_id,
	temperature,
	humidity,
	air_quality,
	created_at
}:SensorCardProps) {
	return (
		<div
        hx-get={`/sensor/${device_id}/readings/latest`}
        hx-trigger="every 1s"
        hx-swap="innerHTML"
      >
       temp: {temperature}
       humidity: {humidity}
       air quality: {air_quality}

       time: {created_at}

      </div>)
}