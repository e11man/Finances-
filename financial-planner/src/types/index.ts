export interface MonthData {
  id: string;
  month: number; // 0-11 for Jan-Dec
  year: number;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  notes?: string;
  rolloverFromPrevious?: number;
  totalAvailable?: number;
  remaining?: number;
}

export interface ProjectionData {
  monthlyContribution: number;
  annualROI: number;
  targetAge?: number;
  projectedValue?: number;
}

export interface UserData {
  email?: string;
  age?: number;
  months: MonthData[];
  projection: ProjectionData;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  netWorth: number;
  projectedValueAtTargetAge?: number;
}