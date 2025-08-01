"use client";
import { useState } from "react";
import clsx from "clsx";

interface MonthData {
  name: string;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  rollover: number;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function MonthlyGrid() {
  // Initialize 12 months starting current month
  const now = new Date();
  const [months, setMonths] = useState<MonthData[]>(() => {
    const arr: MonthData[] = [];
    let rollover = 0;
    for (let i = 0; i < 12; i++) {
      const dateIdx = (now.getMonth() + i) % 12;
      arr.push({
        name: monthNames[dateIdx],
        income: 0,
        expenses: 0,
        savings: 0,
        investments: 0,
        rollover,
      });
    }
    return arr;
  });

  function handleChange(index: number, field: keyof Omit<MonthData, "name" | "rollover">, value: number) {
    setMonths((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value } as MonthData;
      // Recalculate rollovers from this month forward
      for (let i = index; i < updated.length; i++) {
        const prevBalance = i === 0 ? 0 : updated[i - 1].rollover;
        const calcBalance =
          prevBalance +
          (updated[i].income || 0) -
          (updated[i].expenses || 0) -
          (updated[i].savings || 0) -
          (updated[i].investments || 0);
        updated[i].rollover = calcBalance;
      }
      return updated;
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {months.map((m, idx) => (
        <div key={m.name + idx} className="bg-surface shadow rounded p-4">
          <h3 className="font-semibold mb-2 text-primary">{m.name}</h3>
          <div className="space-y-2">
            {(["income", "expenses", "savings", "investments"] as const).map((field) => (
              <div key={field} className="flex items-center justify-between">
                <label className="capitalize text-sm">{field}</label>
                <input
                  type="number"
                  className={clsx("border rounded px-2 py-1 w-28 text-right", "focus:outline-primary-light")}
                  value={m[field]}
                  onChange={(e) => handleChange(idx, field, Number(e.target.value))}
                />
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t mt-2">
              <span className="text-sm font-medium">Rollover</span>
              <span className="font-semibold">${m.rollover.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}