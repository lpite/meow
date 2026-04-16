type VentilationCardProps = {
  speed: number;
  status: string;
};

export function VentilationCard({
  speed,
  status,
}: VentilationCardProps) {
  return (
    <div class="bg-slate-500 p-4 rounded-xl text-white flex flex-col items-center">
      <img
        class="h-24 object-cover mb-6"
        src="/static/ventilation.png"
        alt="Ventilation"
      />
      <div class="w-full flex justify-between text-gray-900">
        <span>speed</span>
        <span>{speed}%</span>
      </div>
      <div class="w-full flex justify-between text-gray-900">
        <span>status</span>
        <span>{status}</span>
      </div>
    </div>
  );
}