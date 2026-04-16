import { Layout } from "../components/layout";
import { RobotCard } from "../components/robot-card";

type RobotsPageProps = {
  robots: {
    id: string;
  }[];
};

export function RobotsPage({ robots }: RobotsPageProps) {
  return (
    <Layout>
      <h1 class="text-white text-xl pb-2">Robots</h1>
      <div class="grid grid-cols-4 gap-3 w-full">
        {robots.map((robot)=><RobotCard {...robot} batteryLevel={40} status="Working" />)}
      </div>
    </Layout>
  );
}
