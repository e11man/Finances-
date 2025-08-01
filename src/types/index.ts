export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  tag: string;
  description?: string;
}

export interface MonthData {
  id: string;
  month: number; // 1-12
  year: number;
  transactions: Transaction[];
  notes: string;
  rolloverFromPrevious: number;
  remainingFunds: number;
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number; // percentage
  minimumPayment: number;
}

export interface InitialFinances {
  currentMoney: number;
  debts: DebtItem[];
  setupComplete: boolean;
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
  initialFinances: InitialFinances;
  months: MonthData[];
  projectionSettings: ProjectionSettings;
}