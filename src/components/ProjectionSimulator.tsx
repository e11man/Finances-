'use client';

import { useState, useEffect, useRef } from 'react';
import { AppState, ProjectionSettings } from '@/types';
import { calculateProjection, formatCurrency, getTotalSavingsAndInvestments } from '@/utils/calculations';
import { loadFromLocalStorage, saveToLocalStorage, exportToJSON, importFromJSON } from '@/utils/storage';

export default function ProjectionSimulator() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [settings, setSettings] = useState<ProjectionSettings>({
    monthlyContribution: 500,
    annualROI: 7,
    currentAge: 25,
    targetAge: 65
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loaded = loadFromLocalStorage();
    if (loaded) {
      setAppState(loaded);
      setSettings(loaded.projectionSettings);
    }
    setIsLoading(false);
  }, []);

  const handleSettingsChange = (field: keyof ProjectionSettings, value: number) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    
    if (appState) {
      const updatedAppState = {
        ...appState,
        projectionSettings: newSettings
      };
      setAppState(updatedAppState);
      saveToLocalStorage(updatedAppState);
    }
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
      setAppState(importedData);
      setSettings(importedData.projectionSettings);
      saveToLocalStorage(importedData);
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

  const currentSavings = appState ? getTotalSavingsAndInvestments(appState.months) : 0;
  const projectedValue = calculateProjection(currentSavings, settings);
  const yearsToTarget = settings.targetAge - settings.currentAge;
  const totalContributions = settings.monthlyContribution * 12 * yearsToTarget;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projection Simulator</h1>
              <p className="text-gray-600 mt-1">Discover what you'll have at any age</p>
            </div>
            
            {/* Export/Import Buttons */}
            <div className="flex space-x-2">
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
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Projection Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={settings.currentAge}
                  onChange={(e) => handleSettingsChange('currentAge', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Age
                </label>
                <input
                  type="number"
                  value={settings.targetAge}
                  onChange={(e) => handleSettingsChange('targetAge', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={settings.currentAge + 1}
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Contribution (after 12 months)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={settings.monthlyContribution}
                    onChange={(e) => handleSettingsChange('monthlyContribution', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual ROI (%)
                </label>
                <input
                  type="number"
                  value={settings.annualROI}
                  onChange={(e) => handleSettingsChange('annualROI', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="50"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Projection Results</h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {formatCurrency(projectedValue)}
                </div>
                <div className="text-gray-600">
                  Estimated value at age {settings.targetAge}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current savings from 12-month plan:</span>
                  <span className="font-medium">{formatCurrency(currentSavings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Years to target:</span>
                  <span className="font-medium">{yearsToTarget} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly contributions:</span>
                  <span className="font-medium">{formatCurrency(settings.monthlyContribution)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total future contributions:</span>
                  <span className="font-medium">{formatCurrency(totalContributions)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Expected annual return:</span>
                  <span className="font-medium">{settings.annualROI}%</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Growth Breakdown</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <div>Starting amount: {formatCurrency(currentSavings)}</div>
                  <div>Total contributions: {formatCurrency(totalContributions)}</div>
                  <div>Investment growth: {formatCurrency(projectedValue - currentSavings - totalContributions)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation Message */}
        {projectedValue > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              You're on track for financial success! 🎉
            </h3>
            <p className="text-blue-800">
              By consistently saving {formatCurrency(settings.monthlyContribution)} per month and earning {settings.annualROI}% annually, 
              you'll build substantial wealth over {yearsToTarget} years. 
              Small, consistent actions lead to big results!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}