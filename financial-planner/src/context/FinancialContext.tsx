import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MonthData, ProjectionData, UserData } from '../types';
import { calculateMonthlyRollover, generateInitialMonths } from '../utils/calculations';

interface FinancialContextType {
  userData: UserData;
  updateMonth: (monthId: string, data: Partial<MonthData>) => void;
  updateProjection: (projection: Partial<ProjectionData>) => void;
  updateUserInfo: (info: { email?: string; age?: number }) => void;
  resetData: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const STORAGE_KEY = 'financial-planner-data';

const defaultUserData: UserData = {
  email: '',
  age: 25,
  months: generateInitialMonths(),
  projection: {
    monthlyContribution: 500,
    annualROI: 7,
    targetAge: 65
  }
};

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultUserData;
      }
    }
    return defaultUserData;
  });

  // Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

  const updateMonth = (monthId: string, data: Partial<MonthData>) => {
    setUserData(prev => {
      const updatedMonths = prev.months.map(month =>
        month.id === monthId ? { ...month, ...data } : month
      );
      // Recalculate rollovers
      const monthsWithRollover = calculateMonthlyRollover(updatedMonths);
      return { ...prev, months: monthsWithRollover };
    });
  };

  const updateProjection = (projection: Partial<ProjectionData>) => {
    setUserData(prev => ({
      ...prev,
      projection: { ...prev.projection, ...projection }
    }));
  };

  const updateUserInfo = (info: { email?: string; age?: number }) => {
    setUserData(prev => ({ ...prev, ...info }));
  };

  const resetData = () => {
    setUserData(defaultUserData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <FinancialContext.Provider
      value={{
        userData,
        updateMonth,
        updateProjection,
        updateUserInfo,
        resetData
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};