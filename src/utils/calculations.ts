import { MonthData, ProjectionSettings, Transaction, DebtItem } from '@/types';

export function calculateMonthlyIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateMonthlyExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateRemainingFunds(month: MonthData): number {
  const income = calculateMonthlyIncome(month.transactions);
  const expenses = calculateMonthlyExpenses(month.transactions);
  return income + month.rolloverFromPrevious - expenses;
}

export function calculateRolloverAmount(months: MonthData[], currentMonthIndex: number): number {
  if (currentMonthIndex === 0) return 0;
  
  const previousMonth = months[currentMonthIndex - 1];
  return calculateRemainingFunds(previousMonth);
}

export function updateMonthWithRollover(months: MonthData[]): MonthData[] {
  return months.map((month, index) => {
    const rolloverFromPrevious = calculateRolloverAmount(months, index);
    const income = calculateMonthlyIncome(month.transactions);
    const expenses = calculateMonthlyExpenses(month.transactions);
    const remainingFunds = income + rolloverFromPrevious - expenses;
    
    return {
      ...month,
      rolloverFromPrevious,
      remainingFunds
    };
  });
}

export function calculateFutureValue(
  currentValue: number,
  monthlyContribution: number,
  annualROI: number,
  years: number
): number {
  const monthlyROI = annualROI / 100 / 12;
  const totalMonths = years * 12;
  
  // Future value of current amount
  const futureCurrentValue = currentValue * Math.pow(1 + monthlyROI, totalMonths);
  
  // Future value of monthly contributions (annuity)
  const futureContributions = monthlyContribution * 
    ((Math.pow(1 + monthlyROI, totalMonths) - 1) / monthlyROI);
  
  return futureCurrentValue + futureContributions;
}

export function calculateProjection(
  totalSavings: number,
  settings: ProjectionSettings
): number {
  const yearsToTarget = settings.targetAge - settings.currentAge;
  return calculateFutureValue(
    totalSavings,
    settings.monthlyContribution,
    settings.annualROI,
    yearsToTarget
  );
}

export function getTotalSavings(months: MonthData[]): number {
  return months.reduce((total, month) => {
    const savingsTransactions = month.transactions.filter(t => 
      t.type === 'expense' && (
        t.tag.toLowerCase().includes('saving') || 
        t.tag.toLowerCase().includes('investment') ||
        t.tag.toLowerCase().includes('emergency fund') ||
        t.tag.toLowerCase().includes('retirement')
      )
    );
    return total + savingsTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, 0);
}

export function getTotalByTag(months: MonthData[], tag: string): number {
  return months.reduce((total, month) => {
    const taggedTransactions = month.transactions.filter(t => 
      t.tag.toLowerCase() === tag.toLowerCase()
    );
    return total + taggedTransactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);
  }, 0);
}

export function getAllTags(months: MonthData[]): string[] {
  const tags = new Set<string>();
  months.forEach(month => {
    month.transactions.forEach(transaction => {
      if (transaction.tag.trim()) {
        tags.add(transaction.tag);
      }
    });
  });
  return Array.from(tags).sort();
}

export function calculateTotalDebt(debts: DebtItem[]): number {
  return debts.reduce((sum, debt) => sum + debt.balance, 0);
}

export function calculateMonthlyDebtPayments(debts: DebtItem[]): number {
  return debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
}

export function calculateNetWorth(currentMoney: number, totalSavings: number, totalDebt: number): number {
  return currentMoney + totalSavings - totalDebt;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}