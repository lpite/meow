type VentilationsPageProps = {
  ventilations: {
    id: string;
  }[];
};

import { Layout } from "../components/layout";
import { VentilationCard } from "../components/ventilation-card";

export function VentilationsPage({
  ventilations,
}: VentilationsPageProps) {
  return (
    <Layout>
      <h1 class="text-white text-xl pb-2">Ventilations</h1>
      <div class="grid grid-cols-4 gap-3 w-full">
        {ventilations.map((ventilation) => (
          <VentilationCard
            {...ventilation}
            status="Running"
            speed={75}
          />
        ))}
      </div>
    </Layout>
  );
}