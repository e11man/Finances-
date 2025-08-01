'use client';

import { useState } from 'react';
import { DebtItem, InitialFinances } from '@/types';
import { formatCurrency, calculateTotalDebt, calculateMonthlyDebtPayments } from '@/utils/calculations';
import { generateDebtId } from '@/utils/storage';

interface InitialSetupProps {
  initialFinances: InitialFinances;
  onComplete: (finances: InitialFinances) => void;
}

export default function InitialSetup({ initialFinances, onComplete }: InitialSetupProps) {
  const [currentMoney, setCurrentMoney] = useState(initialFinances.currentMoney);
  const [debts, setDebts] = useState<DebtItem[]>(initialFinances.debts);
  const [isAddingDebt, setIsAddingDebt] = useState(false);
  const [newDebt, setNewDebt] = useState<Omit<DebtItem, 'id'>>({
    name: '',
    balance: 0,
    interestRate: 0,
    minimumPayment: 0,
  });

  const handleAddDebt = () => {
    if (newDebt.name.trim() && newDebt.balance > 0) {
      const debt: DebtItem = {
        id: generateDebtId(),
        ...newDebt,
      };
      setDebts([...debts, debt]);
      setNewDebt({ name: '', balance: 0, interestRate: 0, minimumPayment: 0 });
      setIsAddingDebt(false);
    }
  };

  const handleRemoveDebt = (debtId: string) => {
    setDebts(debts.filter(debt => debt.id !== debtId));
  };

  const handleEditDebt = (debtId: string, field: keyof Omit<DebtItem, 'id'>, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === debtId 
        ? { ...debt, [field]: value }
        : debt
    ));
  };

  const handleComplete = () => {
    const updatedFinances: InitialFinances = {
      currentMoney,
      debts,
      setupComplete: true,
    };
    onComplete(updatedFinances);
  };

  const totalDebt = calculateTotalDebt(debts);
  const monthlyDebtPayments = calculateMonthlyDebtPayments(debts);
  const netWorth = currentMoney - totalDebt;

  return (
    <div className="min-h-screen bg-background-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-sm border border-background-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-2">
              Welcome to Financial Planner! 🎯
            </h1>
            <p className="text-primary-600">
              Let's start by setting up your current financial situation
            </p>
          </div>

          {/* Current Money Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary-600 mb-4">Current Money</h2>
            <div className="bg-background-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-primary-700 mb-2">
                How much money do you currently have? (checking, savings, cash)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 font-medium">$</span>
                <input
                  type="number"
                  value={currentMoney}
                  onChange={(e) => setCurrentMoney(parseFloat(e.target.value) || 0)}
                  className="form-input pl-8"
                  placeholder="0"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* Debts Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary-600">Debts</h2>
              <button
                onClick={() => setIsAddingDebt(true)}
                className="btn-accent text-sm px-3 py-2"
              >
                Add Debt
              </button>
            </div>

            {debts.length === 0 ? (
              <div className="bg-background-50 rounded-lg p-6 text-center">
                <p className="text-primary-600">No debts added yet. Great job! 🎉</p>
                <p className="text-sm text-primary-500 mt-1">
                  If you have any debts (credit cards, loans, etc.), add them here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {debts.map((debt) => (
                  <div key={debt.id} className="bg-background-50 rounded-lg p-4 border border-background-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-primary-600 mb-1">Name</label>
                        <input
                          type="text"
                          value={debt.name}
                          onChange={(e) => handleEditDebt(debt.id, 'name', e.target.value)}
                          className="form-input text-sm"
                          placeholder="Credit Card"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-primary-600 mb-1">Balance</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 text-sm">$</span>
                          <input
                            type="number"
                            value={debt.balance}
                            onChange={(e) => handleEditDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                            className="form-input text-sm pl-8"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-primary-600 mb-1">Interest Rate (%)</label>
                        <input
                          type="number"
                          value={debt.interestRate}
                          onChange={(e) => handleEditDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                          className="form-input text-sm"
                          placeholder="0"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-primary-600 mb-1">Min Payment</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 text-sm">$</span>
                          <input
                            type="number"
                            value={debt.minimumPayment}
                            onChange={(e) => handleEditDebt(debt.id, 'minimumPayment', parseFloat(e.target.value) || 0)}
                            className="form-input text-sm pl-8"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleRemoveDebt(debt.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Debt Form */}
            {isAddingDebt && (
              <div className="mt-4 bg-accent-50 rounded-lg p-4 border border-accent-200">
                <h3 className="font-medium text-accent-800 mb-3">Add New Debt</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Debt Name</label>
                    <input
                      type="text"
                      value={newDebt.name}
                      onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                      className="form-input"
                      placeholder="e.g., Credit Card, Student Loan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Current Balance</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 font-medium">$</span>
                      <input
                        type="number"
                        value={newDebt.balance}
                        onChange={(e) => setNewDebt({ ...newDebt, balance: parseFloat(e.target.value) || 0 })}
                        className="form-input pl-8"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      value={newDebt.interestRate}
                      onChange={(e) => setNewDebt({ ...newDebt, interestRate: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      placeholder="0"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Minimum Payment</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 font-medium">$</span>
                      <input
                        type="number"
                        value={newDebt.minimumPayment}
                        onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: parseFloat(e.target.value) || 0 })}
                        className="form-input pl-8"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddDebt}
                    className="btn-accent"
                    disabled={!newDebt.name.trim() || newDebt.balance <= 0}
                  >
                    Add Debt
                  </button>
                  <button
                    onClick={() => setIsAddingDebt(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Section */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-blue-800 font-medium text-sm">Current Money</div>
              <div className="text-xl font-bold text-blue-600">
                {formatCurrency(currentMoney)}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-red-800 font-medium text-sm">Total Debt</div>
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(totalDebt)}
              </div>
            </div>
            <div className={`border rounded-lg p-4 text-center ${
              netWorth >= 0 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className={`font-medium text-sm ${
                netWorth >= 0 ? 'text-green-800' : 'text-red-800'
              }`}>
                Net Worth
              </div>
              <div className={`text-xl font-bold ${
                netWorth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(netWorth)}
              </div>
            </div>
          </div>

          {monthlyDebtPayments > 0 && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="font-medium text-yellow-800">Monthly Debt Payments</span>
              </div>
              <p className="text-yellow-700 text-sm">
                You have <strong>{formatCurrency(monthlyDebtPayments)}</strong> in minimum monthly debt payments. 
                Consider including debt payments in your monthly expense planning.
              </p>
            </div>
          )}

          {/* Complete Setup Button */}
          <div className="text-center">
            <button
              onClick={handleComplete}
              className="btn-primary text-lg px-8 py-3"
            >
              Start Planning Your Finances! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}