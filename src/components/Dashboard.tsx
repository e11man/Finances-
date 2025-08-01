'use client';

import { useEffect, useState } from 'react';
import { AppState, MonthData } from '@/types';
import { updateMonthWithRollover, formatCurrency, getTotalSavingsAndInvestments } from '@/utils/calculations';
import { loadFromLocalStorage, saveToLocalStorage, createInitialAppState } from '@/utils/storage';
import MonthCard from './MonthCard';

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = loadFromLocalStorage();
    if (loaded) {
      // Recalculate rollovers in case of any data inconsistency
      const updatedMonths = updateMonthWithRollover(loaded.months);
      setAppState({ ...loaded, months: updatedMonths });
    } else {
      setAppState(createInitialAppState());
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (appState) {
      saveToLocalStorage(appState);
    }
  }, [appState]);

  const handleMonthUpdate = (updatedMonth: MonthData) => {
    if (!appState) return;

    const updatedMonths = appState.months.map(month =>
      month.id === updatedMonth.id ? updatedMonth : month
    );

    // Recalculate all rollovers after update
    const monthsWithRollover = updateMonthWithRollover(updatedMonths);

    setAppState({
      ...appState,
      months: monthsWithRollover
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!appState) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error loading application data</div>
      </div>
    );
  }

  const totalSavings = getTotalSavingsAndInvestments(appState.months);
  const totalIncome = appState.months.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = appState.months.reduce((sum, month) => sum + month.expenses, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Planner</h1>
              <p className="text-gray-600 mt-1">Your 12-month financial roadmap</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Savings & Investments</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalSavings)}
              </div>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-800 font-medium">Total Income</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 font-medium">Total Expenses</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-800 font-medium">Net Savings</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalIncome - totalExpenses)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Monthly Breakdown</h2>
          <div className="text-sm text-gray-600">
            Click "Edit" on any month to update your financial data
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {appState.months.map((month) => (
            <MonthCard
              key={month.id}
              month={month}
              onUpdate={handleMonthUpdate}
            />
          ))}
        </div>

        {/* Rollover Explanation */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How Rollover Works</h3>
          <p className="text-blue-800 text-sm">
            Any remaining funds from each month (Income - Expenses - Savings - Investments) 
            automatically roll over to the next month. Green rollover indicators show 
            when funds carry forward to help with your planning.
          </p>
        </div>
      </div>
    </div>
  );
}