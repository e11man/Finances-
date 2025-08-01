import React from 'react';
import { format } from 'date-fns';
import { MonthData } from '../types';
import { useFinancial } from '../context/FinancialContext';
import './MonthCard.css';

interface MonthCardProps {
  month: MonthData;
  isFirst?: boolean;
}

export const MonthCard: React.FC<MonthCardProps> = ({ month, isFirst = false }) => {
  const { updateMonth } = useFinancial();
  const monthDate = new Date(month.year, month.month);

  const handleInputChange = (field: keyof MonthData, value: string) => {
    const numValue = parseFloat(value) || 0;
    updateMonth(month.id, { [field]: numValue });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="month-card">
      <div className="month-header">
        <h3>{format(monthDate, 'MMMM yyyy')}</h3>
        {!isFirst && month.rolloverFromPrevious! > 0 && (
          <div className="rollover-indicator">
            +{formatCurrency(month.rolloverFromPrevious!)} rollover
          </div>
        )}
      </div>

      <div className="month-inputs">
        <div className="input-group">
          <label htmlFor={`income-${month.id}`}>Income</label>
          <input
            id={`income-${month.id}`}
            type="number"
            value={month.income || ''}
            onChange={(e) => handleInputChange('income', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="input-group">
          <label htmlFor={`expenses-${month.id}`}>Expenses</label>
          <input
            id={`expenses-${month.id}`}
            type="number"
            value={month.expenses || ''}
            onChange={(e) => handleInputChange('expenses', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="input-group">
          <label htmlFor={`savings-${month.id}`}>Savings</label>
          <input
            id={`savings-${month.id}`}
            type="number"
            value={month.savings || ''}
            onChange={(e) => handleInputChange('savings', e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="input-group">
          <label htmlFor={`investments-${month.id}`}>Investments</label>
          <input
            id={`investments-${month.id}`}
            type="number"
            value={month.investments || ''}
            onChange={(e) => handleInputChange('investments', e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="month-summary">
        <div className="summary-row">
          <span>Total Available:</span>
          <span className="amount">{formatCurrency(month.totalAvailable || 0)}</span>
        </div>
        <div className="summary-row remaining">
          <span>Remaining:</span>
          <span className={`amount ${(month.remaining || 0) < 0 ? 'negative' : 'positive'}`}>
            {formatCurrency(month.remaining || 0)}
          </span>
        </div>
      </div>

      <div className="notes-section">
        <textarea
          value={month.notes || ''}
          onChange={(e) => updateMonth(month.id, { notes: e.target.value })}
          placeholder="Add notes..."
          rows={2}
        />
      </div>
    </div>
  );
};