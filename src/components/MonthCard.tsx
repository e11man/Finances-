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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {MONTH_NAMES[month.month - 1]} {month.year}
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {month.rolloverFromPrevious > 0 && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
          <span className="text-green-700 font-medium">
            Rollover: {formatCurrency(month.rolloverFromPrevious)}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income
              </label>
              <input
                type="number"
                value={editData.income}
                onChange={(e) => handleInputChange('income', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expenses
              </label>
              <input
                type="number"
                value={editData.expenses}
                onChange={(e) => handleInputChange('expenses', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Savings
              </label>
              <input
                type="number"
                value={editData.savings}
                onChange={(e) => handleInputChange('savings', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investments
              </label>
              <input
                type="number"
                value={editData.investments}
                onChange={(e) => handleInputChange('investments', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={editData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Income:</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(month.income)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expenses:</span>
              <span className="text-sm font-medium text-red-600">
                {formatCurrency(month.expenses)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Savings:</span>
              <span className="text-sm font-medium text-blue-600">
                {formatCurrency(month.savings)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Investments:</span>
              <span className="text-sm font-medium text-purple-600">
                {formatCurrency(month.investments)}
              </span>
            </div>
            {month.notes && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">{month.notes}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Remaining:</span>
          <span className={`text-sm font-bold ${
            month.remainingFunds >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(month.remainingFunds)}
          </span>
        </div>
      </div>
    </div>
  );
}