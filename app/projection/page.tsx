"use client";
import { useState } from "react";

export const metadata = {
  title: "Projection Simulator | Financial Planner",
};

function calculateFutureValue(monthly: number, roi: number, years: number) {
  const monthlyRate = roi / 12;
  const months = years * 12;
  return monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

export default function ProjectionPage() {
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [roi, setRoi] = useState(0.05);
  const [years, setYears] = useState(10);

  const futureValue = calculateFutureValue(monthlyContribution, roi, years);

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Projection Simulator</h1>
      <div className="space-y-4">
        <div className="flex justify-between">
          <label>Monthly contribution ($)</label>
          <input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="border rounded px-2 py-1 w-32 text-right"
          />
        </div>
        <div className="flex justify-between">
          <label>Annual ROI (%)</label>
          <input
            type="number"
            step="0.01"
            value={roi}
            onChange={(e) => setRoi(Number(e.target.value))}
            className="border rounded px-2 py-1 w-32 text-right"
          />
        </div>
        <div className="flex justify-between">
          <label>Years</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="border rounded px-2 py-1 w-32 text-right"
          />
        </div>
        <div className="pt-4 border-t">
          <p className="text-lg font-medium">
            Future value: <span className="text-primary font-bold">${futureValue.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </main>
  );
}