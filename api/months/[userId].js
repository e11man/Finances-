import { query } from '../../_lib/db.js';

export default async function handler(req, res) {
  const {
    query: { userId },
    method,
  } = req;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    switch (method) {
      case 'GET': {
        const { rows } = await query(
          'SELECT * FROM months WHERE user_id = $1 ORDER BY month_date ASC LIMIT 12',
          [userId]
        );
        return res.status(200).json(rows);
      }
      case 'POST': {
        const { monthDate, income = 0, expenses = 0, savings = 0, investments = 0, notes = '' } = req.body;
        const { rows } = await query(
          `INSERT INTO months (user_id, month_date, income, expenses, savings, investments, notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (user_id, month_date)
           DO UPDATE SET income=$3, expenses=$4, savings=$5, investments=$6, notes=$7
           RETURNING *`,
          [userId, monthDate, income, expenses, savings, investments, notes]
        );
        return res.status(200).json(rows[0]);
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}