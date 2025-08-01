import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, PiggyBank, Wallet } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import './Summary.css';

export const Summary: React.FC = () => {
  const { userData } = useFinancial();
  const { months } = userData;

  const summary = useMemo(() => {
    return months.reduce((acc, month) => ({
      totalIncome: acc.totalIncome + month.income,
      totalExpenses: acc.totalExpenses + month.expenses,
      totalSavings: acc.totalSavings + month.savings,
      totalInvestments: acc.totalInvestments + month.investments,
    }), {
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
      totalInvestments: 0,
    });
  }, [months]);

  const netIncome = summary.totalIncome - summary.totalExpenses;
  const savingsRate = summary.totalIncome > 0 
    ? ((summary.totalSavings + summary.totalInvestments) / summary.totalIncome * 100).toFixed(1)
    : '0';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    {
      icon: <DollarSign size={20} />,
      label: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      color: 'blue',
    },
    {
      icon: <Wallet size={20} />,
      label: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      color: 'red',
    },
    {
      icon: <PiggyBank size={20} />,
      label: 'Total Savings',
      value: formatCurrency(summary.totalSavings),
      color: 'green',
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Total Investments',
      value: formatCurrency(summary.totalInvestments),
      color: 'purple',
    },
  ];

  return (
    <div className="summary-section">
      <h2>12-Month Summary</h2>
      
      <div className="summary-cards">
        {cards.map((card, index) => (
          <div key={index} className={`summary-card ${card.color}`}>
            <div className="card-icon">
              {card.icon}
            </div>
            <div className="card-content">
              <p className="card-label">{card.label}</p>
              <p className="card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="summary-insights">
        <div className="insight-card">
          <h3>Net Income</h3>
          <p className={`insight-value ${netIncome >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(netIncome)}
          </p>
          <span className="insight-description">After expenses</span>
        </div>

        <div className="insight-card">
          <h3>Savings Rate</h3>
          <p className="insight-value">{savingsRate}%</p>
          <span className="insight-description">Of total income</span>
        </div>

        <div className="insight-card">
          <h3>Monthly Average</h3>
          <p className="insight-value">
            {formatCurrency((summary.totalSavings + summary.totalInvestments) / 12)}
          </p>
          <span className="insight-description">Saved & invested</span>
        </div>
      </div>
    </div>
  );
};