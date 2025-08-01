import { MonthData, ProjectionData } from '../types';

export const calculateMonthlyRollover = (months: MonthData[]): MonthData[] => {
  const updatedMonths = [...months];
  
  for (let i = 0; i < updatedMonths.length; i++) {
    const month = updatedMonths[i];
    
    // Calculate rollover from previous month
    if (i === 0) {
      month.rolloverFromPrevious = 0;
    } else {
      const previousMonth = updatedMonths[i - 1];
      month.rolloverFromPrevious = previousMonth.remaining || 0;
    }
    
    // Calculate total available and remaining
    month.totalAvailable = month.income + (month.rolloverFromPrevious || 0);
    month.remaining = month.totalAvailable - month.expenses - month.savings - month.investments;
  }
  
  return updatedMonths;
};

export const calculateFutureValue = (
  currentSavings: number,
  monthlyContribution: number,
  annualROI: number,
  years: number
): number => {
  // Convert annual ROI to monthly
  const monthlyROI = annualROI / 12 / 100;
  const months = years * 12;
  
  // Future value formula for compound interest with monthly contributions
  const futureValue = currentSavings * Math.pow(1 + monthlyROI, months) +
    monthlyContribution * ((Math.pow(1 + monthlyROI, months) - 1) / monthlyROI);
  
  return Math.round(futureValue * 100) / 100;
};

export const calculateProjection = (
  totalCurrentSavings: number,
  projection: ProjectionData,
  currentAge: number
): ProjectionData => {
  if (!projection.targetAge || projection.targetAge <= currentAge) {
    return projection;
  }
  
  const yearsToTarget = projection.targetAge - currentAge;
  const projectedValue = calculateFutureValue(
    totalCurrentSavings,
    projection.monthlyContribution,
    projection.annualROI,
    yearsToTarget
  );
  
  return {
    ...projection,
    projectedValue
  };
};

export const generateInitialMonths = (startDate: Date = new Date()): MonthData[] => {
  const months: MonthData[] = [];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    months.push({
      id: `month-${i}`,
      month: date.getMonth(),
      year: date.getFullYear(),
      income: 0,
      expenses: 0,
      savings: 0,
      investments: 0,
      rolloverFromPrevious: 0,
      totalAvailable: 0,
      remaining: 0
    });
  }
  
  return months;
};