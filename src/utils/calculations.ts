import { MonthData, ProjectionSettings } from '@/types';

export function calculateRemainingFunds(month: MonthData): number {
  return month.income + month.rolloverFromPrevious - month.expenses - month.savings - month.investments;
}

export function calculateRolloverAmount(months: MonthData[], currentMonthIndex: number): number {
  if (currentMonthIndex === 0) return 0;
  
  const previousMonth = months[currentMonthIndex - 1];
  return calculateRemainingFunds(previousMonth);
}

export function updateMonthWithRollover(months: MonthData[]): MonthData[] {
  return months.map((month, index) => {
    const rolloverFromPrevious = calculateRolloverAmount(months, index);
    const remainingFunds = month.income + rolloverFromPrevious - month.expenses - month.savings - month.investments;
    
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

export function getTotalSavingsAndInvestments(months: MonthData[]): number {
  return months.reduce((total, month) => total + month.savings + month.investments, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}