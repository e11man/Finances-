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
      <div className="min-h-screen bg-background-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-primary-600 font-medium">Loading your financial data...</div>
        </div>
      </div>
    );
  }

  if (!appState) {
    return (
      <div className="min-h-screen bg-background-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-600 font-medium text-lg mb-2">Error loading application data</div>
          <div className="text-primary-600 text-sm">Please refresh the page to try again</div>
        </div>
      </div>
    );
  }

  const totalSavings = getTotalSavingsAndInvestments(appState.months);
  const totalIncome = appState.months.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = appState.months.reduce((sum, month) => sum + month.expenses, 0);

  return (
    <div className="min-h-screen bg-background-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-background-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-500">Financial Planner</h1>
              <p className="text-primary-600 mt-1 text-sm sm:text-base">Your 12-month financial roadmap</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="text-center sm:text-right">
                <div className="text-sm text-primary-600 font-medium">Total Savings & Investments</div>
                <div className="text-xl sm:text-2xl font-bold text-accent-600">
                  {formatCurrency(totalSavings)}
                </div>
              </div>
              
              {/* Export/Import Buttons */}
              <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 w-full sm:w-auto">
                <button
                  onClick={handleExport}
                  className="btn-primary flex-1 sm:flex-none text-sm"
                  disabled={!appState}
                >
                  Export Data
                </button>
                <button
                  onClick={handleImportClick}
                  disabled={isImporting}
                  className="btn-secondary flex-1 sm:flex-none text-sm"
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
            <div className="mt-4 p-3 status-error rounded-lg">
              <div className="font-medium text-sm">Import Error:</div>
              <div className="text-sm">{importError}</div>
            </div>
          )}
          
          {importSuccess && (
            <div className="mt-4 p-3 status-success rounded-lg">
              <div className="font-medium text-sm">Success!</div>
              <div className="text-sm">Data imported successfully</div>
            </div>
          )}
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center sm:text-left">
              <div className="text-green-800 font-medium text-sm">Total Income</div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center sm:text-left">
              <div className="text-red-800 font-medium text-sm">Total Expenses</div>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <div className="text-blue-800 font-medium text-sm">Net Savings</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {formatCurrency(totalIncome - totalExpenses)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-primary-600 mb-2">Monthly Breakdown</h2>
          <div className="text-sm text-primary-600">
            Tap "Edit" on any month to update your financial data
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {appState.months.map((month) => (
            <MonthCard
              key={month.id}
              month={month}
              onUpdate={handleMonthUpdate}
            />
          ))}
        </div>

        {/* Rollover Explanation */}
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-4 sm:p-6">
          <h3 className="font-medium text-primary-800 mb-2 text-center sm:text-left">How Rollover Works</h3>
          <p className="text-primary-700 text-sm leading-relaxed text-center sm:text-left">
            Any remaining funds from each month (Income - Expenses - Savings - Investments) 
            automatically roll over to the next month. Green rollover indicators show 
            when funds carry forward to help with your planning.
          </p>
        </div>
      </div>
    </div>
  );
}