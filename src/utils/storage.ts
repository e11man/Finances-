import { AppState, MonthData, ProjectionSettings, User } from '@/types';

const STORAGE_KEY = 'financial_planner_data';

export function saveToLocalStorage(data: AppState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function loadFromLocalStorage(): AppState | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        return null;
      }
    }
  }
  return null;
}

export function createInitialMonths(): MonthData[] {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  return Array.from({ length: 12 }, (_, index) => {
    let month = currentMonth + index;
    let year = currentYear;
    
    if (month > 12) {
      month = month - 12;
      year = year + 1;
    }
    
    return {
      id: `${year}-${month.toString().padStart(2, '0')}`,
      month,
      year,
      income: 0,
      expenses: 0,
      savings: 0,
      investments: 0,
      notes: '',
      rolloverFromPrevious: 0,
      remainingFunds: 0,
    };
  });
}

export function createInitialAppState(): AppState {
  return {
    user: {
      email: '',
      age: 25,
      currentNetWorth: 0,
    },
    months: createInitialMonths(),
    projectionSettings: {
      monthlyContribution: 500,
      annualROI: 7,
      currentAge: 25,
      targetAge: 65,
    },
  };
}