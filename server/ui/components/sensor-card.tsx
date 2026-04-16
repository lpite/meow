type SensorCardProps = {
  name: string;
  id: string;
  temperature?: number;
  humidity?: number;
  air_quality?: number;
  created_at?: string;
};

function getAirQualityLabel(value?: number) {
  if (!value) {
    return null;
  }

  if (value < 400) {
    return <span class="text-green-600">Good</span>;
  }
  if (value < 600) {
    return <span class="text-yellow-500">Moderate</span>;
  }
  if (value < 1000) {
    return <span class="text-orange-500">Poor</span>;
  }
  if (value < 2000) {
    return <span class="text-red-500">Unhealthy</span>;
  }
  return <span class="text-purple-600">Very Unhealthy</span>;
}

function getTimeLabel(time?: string) {
  if (!time) {
    return null;
  }
  const seconds = Math.floor(
    (new Date().getTime() - new Date(time).getTime() - 3 * 60 * 60 * 1000) /
      1000,
  );
  if (seconds < 60) {
    return <span>{seconds}s ago</span>;
  }
  if (seconds < 3600) {
    return <span>{Math.ceil(seconds / 60)}m ago</span>;
  }
  if (seconds < 86400) {
    return <span>{Math.ceil(seconds / 60 / 60)}h ago</span>;
  }
  return <span>{Math.ceil(seconds / 60 / 60 / 24)}d ago</span>;
}

export function SensorCard({
  id,
  temperature,
  humidity,
  air_quality,
  created_at,
  name,
}: SensorCardProps) {
  return (
    <div
      hx-get={`/sensor/${id}/readings/latest`}
      hx-trigger="every 3s"
      hx-swap="outerHTML"
      class="bg-gray-700 p-4 rounded-xl text-white flex flex-col items-center border border-gray-600 text-neutral-100"
    >
      <span class="flex w-full text-lg font-medium text-neutral-300">
        {name}
      </span>
      {!created_at ? (
        <div class="h-12 flex items-center">Inactive</div>
      ) : (
        <>
          <div class="w-full flex justify-between">
            <span>temperature</span>
            <span>{temperature}°C</span>
          </div>
          <div class="w-full flex justify-between">
            <span>humidity</span>
            <span>{humidity}%</span>
          </div>
          <div class="w-full flex justify-between">
            <span>air quality</span>
            <span title={air_quality?.toString()}>
              {getAirQualityLabel(air_quality)}
            </span>
          </div>
          <div class="w-full flex justify-between">
            <span>last reading</span>
            <span title={created_at}>{getTimeLabel(created_at)}</span>
          </div>
        </>
      )}
    </div>
  );
}
