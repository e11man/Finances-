export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { startingBalance = 0, monthlyContribution = 0, roiPercent = 5, years = 10 } = req.body || {};
  const monthlyRate = roiPercent / 100 / 12;
  let balance = startingBalance;
  const points = [];
  for (let month = 1; month <= years * 12; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (month % 12 === 0) {
      points.push({ year: month / 12, balance: Number(balance.toFixed(2)) });
    }
  }
  return res.status(200).json({ finalBalance: Number(balance.toFixed(2)), points });
}