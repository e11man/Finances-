'use client';

import { useState, useEffect, useRef } from 'react';
import { AppState, ProjectionSettings } from '@/types';
import { calculateProjection, formatCurrency, getTotalSavings } from '@/utils/calculations';
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
      <div className="min-h-screen bg-background-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-primary-600 font-medium">Loading projection data...</div>
        </div>
      </div>
    );
  }

  const currentSavings = appState ? getTotalSavings(appState.months) : 0;
  const projectedValue = calculateProjection(currentSavings, settings);
  const yearsToTarget = settings.targetAge - settings.currentAge;
  const totalContributions = settings.monthlyContribution * 12 * yearsToTarget;

  return (
    <div className="min-h-screen bg-background-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-background-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-500">Projection Simulator</h1>
              <p className="text-primary-600 mt-1 text-sm sm:text-base">Discover what you'll have at any age</p>
            </div>
            
            {/* Export/Import Buttons */}
            <div className="flex flex-row space-x-2 w-full sm:w-auto">
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
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main projection result - prominently displayed on mobile */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-background-200 p-6 text-center">
          <div className="mb-4">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent-600 mb-2">
              {formatCurrency(projectedValue)}
            </div>
            <div className="text-primary-600 text-base sm:text-lg">
              Estimated value at age {settings.targetAge}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-background-50 rounded-lg p-3">
              <div className="text-xs sm:text-sm text-primary-600 mb-1">Current Savings</div>
              <div className="font-bold text-primary-800 text-sm sm:text-base">
                {formatCurrency(currentSavings)}
              </div>
            </div>
            <div className="bg-background-50 rounded-lg p-3">
              <div className="text-xs sm:text-sm text-primary-600 mb-1">Years to Target</div>
              <div className="font-bold text-primary-800 text-sm sm:text-base">
                {yearsToTarget} years
              </div>
            </div>
            <div className="bg-background-50 rounded-lg p-3">
              <div className="text-xs sm:text-sm text-primary-600 mb-1">Monthly</div>
              <div className="font-bold text-primary-800 text-sm sm:text-base">
                {formatCurrency(settings.monthlyContribution)}
              </div>
            </div>
            <div className="bg-background-50 rounded-lg p-3">
              <div className="text-xs sm:text-sm text-primary-600 mb-1">Annual ROI</div>
              <div className="font-bold text-primary-800 text-sm sm:text-base">
                {settings.annualROI}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Settings Panel */}
          <div className="card p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-6 text-center sm:text-left">
              Projection Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={settings.currentAge}
                  onChange={(e) => handleSettingsChange('currentAge', parseInt(e.target.value) || 0)}
                  className="form-input"
                  min="18"
                  max="100"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Target Age
                </label>
                <input
                  type="number"
                  value={settings.targetAge}
                  onChange={(e) => handleSettingsChange('targetAge', parseInt(e.target.value) || 0)}
                  className="form-input"
                  min={settings.currentAge + 1}
                  max="100"
                  placeholder="65"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Monthly Contribution (after 12 months)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 font-medium">$</span>
                  <input
                    type="number"
                    value={settings.monthlyContribution}
                    onChange={(e) => handleSettingsChange('monthlyContribution', parseFloat(e.target.value) || 0)}
                    className="form-input pl-8"
                    min="0"
                    step="50"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Expected Annual ROI (%)
                </label>
                <input
                  type="number"
                  value={settings.annualROI}
                  onChange={(e) => handleSettingsChange('annualROI', parseFloat(e.target.value) || 0)}
                  className="form-input"
                  min="0"
                  max="50"
                  step="0.5"
                  placeholder="7"
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="card p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-primary-600 mb-6 text-center sm:text-left">
              Detailed Breakdown
            </h2>
            
            <div className="space-y-6">
              <div className="bg-background-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-primary-600 text-sm">Current savings from 12-month plan:</span>
                  <span className="font-bold text-primary-800">{formatCurrency(currentSavings)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-background-200 pt-3">
                  <span className="text-primary-600 text-sm">Total future contributions:</span>
                  <span className="font-bold text-primary-800">{formatCurrency(totalContributions)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-background-200 pt-3">
                  <span className="text-primary-600 text-sm">Investment growth:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(projectedValue - currentSavings - totalContributions)}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-3 text-center sm:text-left">Growth Breakdown</h3>
                <div className="text-sm text-green-700 space-y-2">
                  <div className="flex justify-between">
                    <span>Starting amount:</span>
                    <span className="font-medium">{formatCurrency(currentSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total contributions:</span>
                    <span className="font-medium">{formatCurrency(totalContributions)}</span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span>Investment growth:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(projectedValue - currentSavings - totalContributions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivation Message */}
        {projectedValue > 0 && (
          <div className="mt-8 bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-primary-800 mb-3">
              You're on track for financial success! 🎉
            </h3>
            <p className="text-primary-700 leading-relaxed text-sm sm:text-base max-w-3xl mx-auto">
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