export interface MonthData {
  id: string;
  month: number; // 1-12
  year: number;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  notes: string;
  rolloverFromPrevious: number;
  remainingFunds: number;
}

export interface ProjectionSettings {
  monthlyContribution: number;
  annualROI: number; // percentage
  currentAge: number;
  targetAge: number;
}

export interface User {
  email: string;
  age: number;
  currentNetWorth: number;
}

export interface AppState {
  user: User;
  months: MonthData[];
  projectionSettings: ProjectionSettings;
}