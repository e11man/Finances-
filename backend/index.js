// Entry point for backend server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

/*
  Schema (simplified for MVP):
  CREATE TABLE IF NOT EXISTS months (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    month_date DATE NOT NULL,
    income NUMERIC(12,2) DEFAULT 0,
    expenses NUMERIC(12,2) DEFAULT 0,
    savings NUMERIC(12,2) DEFAULT 0,
    investments NUMERIC(12,2) DEFAULT 0,
    notes TEXT DEFAULT ''
  );
*/

// Fetch 12 months of data for a user
app.get('/api/months/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { rows } = await query(
      'SELECT * FROM months WHERE user_id = $1 ORDER BY month_date ASC LIMIT 12',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Upsert month data
app.post('/api/months/:userId', async (req, res) => {
  const { userId } = req.params;
  const {
    monthDate,
    income = 0,
    expenses = 0,
    savings = 0,
    investments = 0,
    notes = '',
  } = req.body;
  try {
    const { rows } = await query(
      `INSERT INTO months (user_id, month_date, income, expenses, savings, investments, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (user_id, month_date)
       DO UPDATE SET income=$3, expenses=$4, savings=$5, investments=$6, notes=$7
       RETURNING *`,
      [userId, monthDate, income, expenses, savings, investments, notes]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Calculate rollover for a user (simple: total income - expenses - savings - investments across months)
app.get('/api/rollover/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { rows } = await query(
      'SELECT income, expenses, savings, investments FROM months WHERE user_id = $1 ORDER BY month_date ASC LIMIT 12',
      [userId]
    );
    let rollover = 0;
    const monthly = rows.map((m) => {
      const leftover = Number(m.income) - Number(m.expenses) - Number(m.savings) - Number(m.investments);
      const withRollover = leftover + rollover;
      rollover = withRollover;
      return { leftover, rollover: withRollover };
    });
    res.json({ monthly, finalRollover: rollover });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Simple ROI projection after 12 months
app.post('/api/projection', (req, res) => {
  const { startingBalance = 0, monthlyContribution = 0, roiPercent = 5, years = 10 } = req.body;
  const monthlyRate = roiPercent / 100 / 12;
  let balance = startingBalance;
  const points = [];
  for (let month = 1; month <= years * 12; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (month % 12 === 0) {
      points.push({ year: month / 12, balance: Number(balance.toFixed(2)) });
    }
  }
  res.json({ finalBalance: Number(balance.toFixed(2)), points });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});