import MonthlyGrid from "../../components/MonthlyGrid";

export const metadata = {
  title: "Dashboard | Financial Planner",
};

export default function DashboardPage() {
  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Monthly Planner</h1>
      <MonthlyGrid />
    </main>
  );
}