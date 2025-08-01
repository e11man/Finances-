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
        
        // Validate the imported data structure
        if (!isValidAppState(data)) {
          throw new Error('Invalid file format. The file does not contain valid financial planner data.');
        }
        
        resolve(data);
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
  
  // Check each month object
  for (const month of data.months) {
    if (!month || typeof month !== 'object') return false;
    if (typeof month.id !== 'string') return false;
    if (typeof month.month !== 'number') return false;
    if (typeof month.year !== 'number') return false;
    if (typeof month.income !== 'number') return false;
    if (typeof month.expenses !== 'number') return false;
    if (typeof month.savings !== 'number') return false;
    if (typeof month.investments !== 'number') return false;
    if (typeof month.notes !== 'string') return false;
    if (typeof month.rolloverFromPrevious !== 'number') return false;
    if (typeof month.remainingFunds !== 'number') return false;
  }
  
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