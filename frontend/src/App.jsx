import React, { useEffect, useState } from 'react';
import axios from 'axios';

const USER_ID = 'demo-user'; // placeholder
const API_BASE = 'http://localhost:4000/api';

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function defaultMonth(index) {
  const now = new Date();
  const year = now.getFullYear();
  const monthDate = new Date(year, now.getMonth() + index, 1);
  return {
    monthDate: monthDate.toISOString().slice(0, 10),
    income: 0,
    expenses: 0,
    savings: 0,
    investments: 0,
    notes: '',
  };
}

export default function App() {
  const [months, setMonths] = useState(() => Array.from({ length: 12 }, (_, i) => defaultMonth(i)));
  const [rollovers, setRollovers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectionInput, setProjectionInput] = useState({ startingBalance: 0, monthlyContribution: 0, roiPercent: 5, years: 10 });
  const [projectionOutput, setProjectionOutput] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/months/${USER_ID}`);
        if (data.length) {
          // Map data to state indexes
          const updated = [...months];
          data.forEach((row, i) => {
            const idx = i;
            updated[idx] = { ...row, monthDate: row.month_date };
          });
          setMonths(updated);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    // Update rollover preview locally
    let rollover = 0;
    const r = months.map((m) => {
      const leftover = m.income - m.expenses - m.savings - m.investments;
      rollover += leftover;
      return rollover;
    });
    setRollovers(r);
  }, [months]);

  const handleChange = (index, field, value) => {
    const updated = [...months];
    updated[index] = { ...updated[index], [field]: Number(value) };
    setMonths(updated);
  };

  const saveMonth = async (index) => {
    const m = months[index];
    try {
      await axios.post(`${API_BASE}/months/${USER_ID}`, m);
      alert('Saved');
    } catch (err) {
      console.error(err);
      alert('Error saving');
    }
  };

  const handleProjectionChange = (field, value) => {
    setProjectionInput({ ...projectionInput, [field]: Number(value) });
  };

  const runProjection = async () => {
    try {
      const { data } = await axios.post(`${API_BASE}/projection`, projectionInput);
      setProjectionOutput(data);
    } catch (err) {
      console.error(err);
      alert('Error calculating projection');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Monthly Planner</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Savings</th>
              <th>Investments</th>
              <th>Leftover / Rollover</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {months.map((m, idx) => {
              const leftover = m.income - m.expenses - m.savings - m.investments;
              return (
                <tr key={idx} style={{ textAlign: 'center', borderTop: '1px solid #ccc' }}>
                  <td>{monthNames[(new Date(m.monthDate)).getMonth()]}</td>
                  <td>
                    <input
                      type="number"
                      value={m.income}
                      onChange={(e) => handleChange(idx, 'income', e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={m.expenses}
                      onChange={(e) => handleChange(idx, 'expenses', e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={m.savings}
                      onChange={(e) => handleChange(idx, 'savings', e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={m.investments}
                      onChange={(e) => handleChange(idx, 'investments', e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>
                    {leftover.toFixed(2)} / {rollovers[idx]?.toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => saveMonth(idx)}>Save</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <hr style={{ margin: '2rem 0' }} />
      <h2>ROI Simulator</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <label>
          Starting Balance
          <input type="number" value={projectionInput.startingBalance} onChange={(e) => handleProjectionChange('startingBalance', e.target.value)} />
        </label>
        <label>
          Monthly Contribution
          <input type="number" value={projectionInput.monthlyContribution} onChange={(e) => handleProjectionChange('monthlyContribution', e.target.value)} />
        </label>
        <label>
          ROI %
          <input type="number" value={projectionInput.roiPercent} onChange={(e) => handleProjectionChange('roiPercent', e.target.value)} />
        </label>
        <label>
          Years
          <input type="number" value={projectionInput.years} onChange={(e) => handleProjectionChange('years', e.target.value)} />
        </label>
        <button onClick={runProjection}>Calculate</button>
      </div>
      {projectionOutput && (
        <p>Final Balance: ${projectionOutput.finalBalance.toLocaleString()}</p>
      )}
    </div>
  );
}