import React from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { Summary } from './components/Summary';
import { MonthCard } from './components/MonthCard';
import { ProjectionCalculator } from './components/ProjectionCalculator';
import { useFinancial } from './context/FinancialContext';
import { RefreshCw } from 'lucide-react';
import './App.css';

const Dashboard: React.FC = () => {
  const { userData, resetData } = useFinancial();

  return (
    <div className="dashboard">
      <header className="app-header">
        <div className="header-content">
          <h1>Financial Planner</h1>
          <p className="tagline">Your monthly-first financial planning companion</p>
        </div>
        <button className="reset-button" onClick={resetData} title="Reset all data">
          <RefreshCw size={18} />
          Reset Data
        </button>
      </header>

      <main className="app-main">
        <Summary />

        <section className="months-section">
          <h2>Monthly Breakdown</h2>
          <div className="months-grid">
            {userData.months.map((month, index) => (
              <MonthCard key={month.id} month={month} isFirst={index === 0} />
            ))}
          </div>
        </section>

        <ProjectionCalculator />
      </main>

      <footer className="app-footer">
        <p>Remember: Small monthly changes lead to big yearly results!</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <FinancialProvider>
      <Dashboard />
    </FinancialProvider>
  );
}

export default App;
