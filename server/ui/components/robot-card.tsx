type RobotCardProps = {
  batteryLevel: number;
  status: string;
};

export function RobotCard({ batteryLevel, status }: RobotCardProps) {
  return (
    <div class="bg-slate-500 p-4 rounded-xl text-white flex flex-col items-center">
      <img class="h-24 object-cover mb-6" src="/static/robot.png" alt="" />
      <div class="w-full flex justify-between text-gray-900">
        <span>batteryLevel</span>
        <span>{batteryLevel}</span>
      </div>
      <div class="w-full flex justify-between text-gray-900">
        <span>status</span>
        <span>{status}</span>
      </div>
    </div>
  );
}
