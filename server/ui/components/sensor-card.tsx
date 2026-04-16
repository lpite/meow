type SensorCardProps = {
  device_id: string;
  temperature?: number;
  humidity?: number;
  air_quality?: number;
  created_at?: string;
};

function getAirQualityLabel(value?:number){
  if(!value){
    return null
  }
  if(value < 300){
    return <span class="text-green-600">Good</span>
  }
  return <span class="text-red-600">Bad</span>
}

export function SensorCard({
  device_id,
  temperature,
  humidity,
  air_quality,
  created_at,
}: SensorCardProps) {
  return (
    <div
      hx-get={`/sensor/${device_id}/readings/latest`}
      hx-trigger="every 1s"
      hx-swap="outerHTML"
      class="bg-slate-500 p-4 rounded-xl text-white flex flex-col items-center"
    >
      <img
        class="h-24 object-cover mb-6"
        src="/static/box.png"
        alt=""
      />
      <div class="w-full flex justify-between text-gray-900">
        <span>temperature</span>
        <span>{temperature}</span>
      </div>
      <div class="w-full flex justify-between text-gray-900">
        <span>humidity</span>
        <span>{humidity}%</span>
      </div>
      <div class="w-full flex justify-between text-gray-900">
        <span>air quality</span>
        <span>{getAirQualityLabel(air_quality)}</span>
      </div>
       time: {created_at}
    </div>
  );
}
