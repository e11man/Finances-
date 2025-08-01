'use client';

import { MonthData } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { useState } from 'react';

interface MonthCardProps {
  month: MonthData;
  onUpdate: (updatedMonth: MonthData) => void;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function MonthCard({ month, onUpdate }: MonthCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(month);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(month);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof MonthData, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: field === 'notes' ? value : parseFloat(value) || 0
    }));
  };

  return (
    <div className="card p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-primary-700">
          {MONTH_NAMES[month.month - 1]} {month.year}
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-accent text-sm px-3 py-2 min-h-[44px] min-w-[44px]"
            aria-label={`Edit ${MONTH_NAMES[month.month - 1]} ${month.year}`}
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500/50 transition-all duration-200 min-h-[44px]"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary text-sm px-3 py-2 min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {month.rolloverFromPrevious > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">↗️</span>
            <span className="text-green-700 font-medium">
              Rollover: {formatCurrency(month.rolloverFromPrevious)}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Income
              </label>
              <input
                type="number"
                value={editData.income}
                onChange={(e) => handleInputChange('income', e.target.value)}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Expenses
              </label>
              <input
                type="number"
                value={editData.expenses}
                onChange={(e) => handleInputChange('expenses', e.target.value)}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Savings
              </label>
              <input
                type="number"
                value={editData.savings}
                onChange={(e) => handleInputChange('savings', e.target.value)}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Investments
              </label>
              <input
                type="number"
                value={editData.investments}
                onChange={(e) => handleInputChange('investments', e.target.value)}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Notes
              </label>
              <textarea
                value={editData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="form-input"
                rows={3}
                placeholder="Add any notes about this month..."
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-primary-600 font-medium">Income:</span>
                <span className="text-sm font-bold text-green-600">
                  {formatCurrency(month.income)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-background-200">
                <span className="text-sm text-primary-600 font-medium">Expenses:</span>
                <span className="text-sm font-bold text-red-600">
                  {formatCurrency(month.expenses)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-background-200">
                <span className="text-sm text-primary-600 font-medium">Savings:</span>
                <span className="text-sm font-bold text-blue-600">
                  {formatCurrency(month.savings)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-background-200">
                <span className="text-sm text-primary-600 font-medium">Investments:</span>
                <span className="text-sm font-bold text-purple-600">
                  {formatCurrency(month.investments)}
                </span>
              </div>
              {month.notes && (
                <div className="pt-3 border-t border-background-200">
                  <div className="text-sm text-primary-600 font-medium mb-1">Notes:</div>
                  <div className="text-sm text-primary-700 bg-background-50 rounded-lg p-3 leading-relaxed">
                    {month.notes}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-background-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-primary-700">Remaining:</span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            month.remainingFunds >= 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {formatCurrency(month.remainingFunds)}
          </span>
        </div>
      </div>
    </div>
  );
}