import { Layout } from "../components/layout";

type DashboardPageProps = {
  sensors: any[];
};

export function DashboardPage({ sensors }: DashboardPageProps) {
  return (
    <Layout>
      <h1 class="text-white text-xl pb-2">Dashboard</h1>

      <div class="grid grid-cols-4 gap-3">
        
      </div>
    </Layout>
  );
}
