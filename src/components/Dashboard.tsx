'use client';

import { useEffect, useState, useRef } from 'react';
import { AppState, MonthData } from '@/types';
import { updateMonthWithRollover, formatCurrency, getTotalSavingsAndInvestments } from '@/utils/calculations';
import { loadFromLocalStorage, saveToLocalStorage, createInitialAppState, exportToJSON, importFromJSON } from '@/utils/storage';
import MonthCard from './MonthCard';

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExport = () => {
    if (appState) {
      exportToJSON(appState);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      const importedData = await importFromJSON(file);
      
      // Recalculate rollovers for imported data
      const updatedMonths = updateMonthWithRollover(importedData.months);
      const finalAppState = { ...importedData, months: updatedMonths };
      
      setAppState(finalAppState);
      saveToLocalStorage(finalAppState);
      setImportSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Unknown error occurred');
      // Clear error message after 5 seconds
      setTimeout(() => setImportError(null), 5000);
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Savings & Investments</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalSavings)}
                </div>
              </div>
              
              {/* Export/Import Buttons */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                  disabled={!appState}
                >
                  Export Data
                </button>
                <button
                  onClick={handleImportClick}
                  disabled={isImporting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isImporting ? 'Importing...' : 'Import Data'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          
          {/* Status Messages */}
          {importError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-800 text-sm font-medium">Import Error:</div>
              <div className="text-red-700 text-sm">{importError}</div>
            </div>
          )}
          
          {importSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="text-green-800 text-sm font-medium">Success!</div>
              <div className="text-green-700 text-sm">Data imported successfully</div>
            </div>
          )}
          
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