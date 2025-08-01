import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { calculateProjection } from '../utils/calculations';
import './ProjectionCalculator.css';

export const ProjectionCalculator: React.FC = () => {
  const { userData, updateProjection, updateUserInfo } = useFinancial();
  const { projection, age, months } = userData;

  const totalCurrentSavings = useMemo(() => {
    return months.reduce((sum, month) => sum + month.savings + month.investments, 0);
  }, [months]);

  const projectionResult = useMemo(() => {
    if (!age) return projection;
    return calculateProjection(totalCurrentSavings, projection, age);
  }, [totalCurrentSavings, projection, age]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const yearsToTarget = projection.targetAge && age ? projection.targetAge - age : 0;

  return (
    <div className="projection-calculator">
      <div className="projection-header">
        <TrendingUp size={24} />
        <h2>Long-Term Projection</h2>
      </div>

      <div className="projection-inputs">
        <div className="input-row">
          <div className="projection-input">
            <label htmlFor="current-age">Current Age</label>
            <input
              id="current-age"
              type="number"
              value={age || ''}
              onChange={(e) => updateUserInfo({ age: parseInt(e.target.value) || 0 })}
              placeholder="25"
            />
          </div>

          <div className="projection-input">
            <label htmlFor="target-age">Target Age</label>
            <input
              id="target-age"
              type="number"
              value={projection.targetAge || ''}
              onChange={(e) => updateProjection({ targetAge: parseInt(e.target.value) || 0 })}
              placeholder="65"
            />
          </div>
        </div>

        <div className="input-row">
          <div className="projection-input">
            <label htmlFor="monthly-contribution">Monthly Contribution</label>
            <input
              id="monthly-contribution"
              type="number"
              value={projection.monthlyContribution || ''}
              onChange={(e) => updateProjection({ monthlyContribution: parseFloat(e.target.value) || 0 })}
              placeholder="500"
            />
          </div>

          <div className="projection-input">
            <label htmlFor="annual-roi">Annual ROI (%)</label>
            <input
              id="annual-roi"
              type="number"
              value={projection.annualROI || ''}
              onChange={(e) => updateProjection({ annualROI: parseFloat(e.target.value) || 0 })}
              placeholder="7"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <div className="projection-results">
        <div className="result-card">
          <h3>Current Savings</h3>
          <p className="result-value">{formatCurrency(totalCurrentSavings)}</p>
          <span className="result-description">From your 12-month plan</span>
        </div>

        <div className="result-card highlight">
          <h3>Projected Value at {projection.targetAge || 65}</h3>
          <p className="result-value">
            {projectionResult.projectedValue 
              ? formatCurrency(projectionResult.projectedValue)
              : '—'
            }
          </p>
          <span className="result-description">
            {yearsToTarget > 0 ? `In ${yearsToTarget} years` : 'Set your ages above'}
          </span>
        </div>

        <div className="result-card">
          <h3>Total Contributions</h3>
          <p className="result-value">
            {yearsToTarget > 0 
              ? formatCurrency(projection.monthlyContribution * 12 * yearsToTarget + totalCurrentSavings)
              : '—'
            }
          </p>
          <span className="result-description">Principal amount</span>
        </div>
      </div>

      {projectionResult.projectedValue && yearsToTarget > 0 && (
        <div className="projection-insight">
          <p>
            By contributing {formatCurrency(projection.monthlyContribution)} monthly for {yearsToTarget} years 
            with a {projection.annualROI}% annual return, your {formatCurrency(totalCurrentSavings)} will 
            grow to {formatCurrency(projectionResult.projectedValue)}.
          </p>
        </div>
      )}
    </div>
  );
};