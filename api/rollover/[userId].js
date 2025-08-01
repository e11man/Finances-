import { query } from '../../_lib/db.js';

export default async function handler(req, res) {
  const {
    query: { userId },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { rows } = await query(
      'SELECT income, expenses, savings, investments FROM months WHERE user_id = $1 ORDER BY month_date ASC LIMIT 12',
      [userId]
    );
    let rollover = 0;
    const monthly = rows.map((m) => {
      const leftover = Number(m.income) - Number(m.expenses) - Number(m.savings) - Number(m.investments);
      rollover += leftover;
      return { leftover, rollover };
    });
    return res.status(200).json({ monthly, finalRollover: rollover });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}