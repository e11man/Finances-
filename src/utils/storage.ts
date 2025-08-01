import { AppState, MonthData, ProjectionSettings, User, InitialFinances, Transaction, DebtItem } from '@/types';

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
        const data = JSON.parse(stored);
        // Migrate old data structure if needed
        return migrateDataIfNeeded(data);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        return null;
      }
    }
  }
  return null;
}

// Migration function for backward compatibility
function migrateDataIfNeeded(data: any): AppState {
  // If data already has the new structure, return as is
  if (data.initialFinances && data.months[0]?.transactions) {
    return data;
  }

  // Migrate old structure to new structure
  const migratedMonths: MonthData[] = data.months.map((month: any) => ({
    id: month.id,
    month: month.month,
    year: month.year,
    transactions: [
      ...(month.income > 0 ? [{
        id: `${month.id}-income-1`,
        type: 'income' as const,
        amount: month.income,
        tag: 'Salary',
        description: 'Monthly income'
      }] : []),
      ...(month.expenses > 0 ? [{
        id: `${month.id}-expense-1`,
        type: 'expense' as const,
        amount: month.expenses,
        tag: 'General Expenses',
        description: 'Monthly expenses'
      }] : []),
      ...(month.savings > 0 ? [{
        id: `${month.id}-saving-1`,
        type: 'expense' as const,
        amount: month.savings,
        tag: 'Savings',
        description: 'Monthly savings'
      }] : []),
      ...(month.investments > 0 ? [{
        id: `${month.id}-investment-1`,
        type: 'expense' as const,
        amount: month.investments,
        tag: 'Investment',
        description: 'Monthly investment'
      }] : [])
    ],
    notes: month.notes || '',
    rolloverFromPrevious: month.rolloverFromPrevious || 0,
    remainingFunds: month.remainingFunds || 0,
  }));

  return {
    user: data.user || {
      email: '',
      age: 25,
      currentNetWorth: 0,
    },
    initialFinances: {
      currentMoney: data.user?.currentNetWorth || 0,
      debts: [],
      setupComplete: true, // Mark as complete for migrated data
    },
    months: migratedMonths,
    projectionSettings: data.projectionSettings || {
      monthlyContribution: 500,
      annualROI: 7,
      currentAge: 25,
      targetAge: 65,
    },
  };
}

// JSON Export/Import Functions
export function exportToJSON(appState: AppState): void {
  const dataStr = JSON.stringify(appState, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `financial-planner-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          throw new Error('File content is not a string');
        }
        
        const data = JSON.parse(result);
        
        // Validate and migrate the imported data structure
        if (!isValidAppState(data)) {
          throw new Error('Invalid file format. The file does not contain valid financial planner data.');
        }
        
        const migratedData = migrateDataIfNeeded(data);
        resolve(migratedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };
    
    reader.readAsText(file);
  });
}

// Validation function to ensure imported data has the correct structure
function isValidAppState(data: any): data is AppState {
  if (!data || typeof data !== 'object') return false;
  
  // Check user object
  if (!data.user || typeof data.user !== 'object') return false;
  if (typeof data.user.email !== 'string') return false;
  if (typeof data.user.age !== 'number') return false;
  if (typeof data.user.currentNetWorth !== 'number') return false;
  
  // Check months array
  if (!Array.isArray(data.months)) return false;
  if (data.months.length === 0) return false;
  
  // Check projection settings
  if (!data.projectionSettings || typeof data.projectionSettings !== 'object') return false;
  if (typeof data.projectionSettings.monthlyContribution !== 'number') return false;
  if (typeof data.projectionSettings.annualROI !== 'number') return false;
  if (typeof data.projectionSettings.currentAge !== 'number') return false;
  if (typeof data.projectionSettings.targetAge !== 'number') return false;
  
  return true;
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
      transactions: [],
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
    initialFinances: {
      currentMoney: 0,
      debts: [],
      setupComplete: false,
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

export function generateTransactionId(monthId: string, type: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${monthId}-${type}-${timestamp}-${random}`;
}

export function generateDebtId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `debt-${timestamp}-${random}`;
}