'use client';

import { MonthData, Transaction } from '@/types';
import { formatCurrency, calculateMonthlyIncome, calculateMonthlyExpenses } from '@/utils/calculations';
import { generateTransactionId } from '@/utils/storage';
import { useState } from 'react';

interface MonthCardProps {
  month: MonthData;
  onUpdate: (updatedMonth: MonthData) => void;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const COMMON_TAGS = {
  income: ['Salary', 'Freelance', 'Side Hustle', 'Investment Returns', 'Other Income'],
  expense: ['Rent/Mortgage', 'Groceries', 'Transportation', 'Utilities', 'Insurance', 'Debt Payment', 'Savings', 'Investment', 'Entertainment', 'Healthcare', 'Other Expense']
};

export default function MonthCard({ month, onUpdate }: MonthCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(month);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    type: 'income',
    amount: 0,
    tag: '',
    description: '',
  });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(month);
    setIsEditing(false);
    setIsAddingTransaction(false);
  };

  const handleAddTransaction = () => {
    if (newTransaction.amount > 0 && newTransaction.tag.trim()) {
      const transaction: Transaction = {
        id: generateTransactionId(month.id, newTransaction.type),
        ...newTransaction,
      };
      setEditData({
        ...editData,
        transactions: [...editData.transactions, transaction]
      });
      setNewTransaction({ type: 'income', amount: 0, tag: '', description: '' });
      setIsAddingTransaction(false);
    }
  };

  const handleRemoveTransaction = (transactionId: string) => {
    setEditData({
      ...editData,
      transactions: editData.transactions.filter(t => t.id !== transactionId)
    });
  };

  const handleEditTransaction = (transactionId: string, field: keyof Omit<Transaction, 'id'>, value: string | number) => {
    setEditData({
      ...editData,
      transactions: editData.transactions.map(t =>
        t.id === transactionId ? { ...t, [field]: value } : t
      )
    });
  };

  const income = calculateMonthlyIncome(month.transactions);
  const expenses = calculateMonthlyExpenses(month.transactions);

  // Group transactions by tag for display
  const transactionsByTag = month.transactions.reduce((acc, transaction) => {
    if (!acc[transaction.tag]) {
      acc[transaction.tag] = { income: 0, expense: 0, transactions: [] };
    }
    acc[transaction.tag][transaction.type] += transaction.amount;
    acc[transaction.tag].transactions.push(transaction);
    return acc;
  }, {} as Record<string, { income: number; expense: number; transactions: Transaction[] }>);

  return (
    <div className="card p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-primary-700">
          {MONTH_NAMES[month.month - 1]} {month.year}
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-accent text-sm px-3 py-2 min-h-[44px] min-w-[44px]"
            aria-label={`Edit ${MONTH_NAMES[month.month - 1]} ${month.year}`}
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500/50 transition-all duration-200 min-h-[44px]"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary text-sm px-3 py-2 min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {month.rolloverFromPrevious > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">↗️</span>
            <span className="text-green-700 font-medium">
              Rollover: {formatCurrency(month.rolloverFromPrevious)}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {isEditing ? (
          <>
            {/* Transaction List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-primary-700">Transactions</h4>
                <button
                  onClick={() => setIsAddingTransaction(true)}
                  className="btn-accent text-xs px-2 py-1"
                >
                  Add Transaction
                </button>
              </div>

              {editData.transactions.length === 0 ? (
                <div className="bg-background-50 rounded-lg p-4 text-center text-sm text-primary-600">
                  No transactions yet. Add your income and expenses.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {editData.transactions.map((transaction) => (
                    <div key={transaction.id} className="bg-background-50 rounded-lg p-3 border border-background-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                        <div>
                          <label className="block text-xs font-medium text-primary-600 mb-1">Type</label>
                          <select
                            value={transaction.type}
                            onChange={(e) => handleEditTransaction(transaction.id, 'type', e.target.value as 'income' | 'expense')}
                            className="form-input text-xs"
                          >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-primary-600 mb-1">Amount</label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-primary-500 text-xs">$</span>
                            <input
                              type="number"
                              value={transaction.amount}
                              onChange={(e) => handleEditTransaction(transaction.id, 'amount', parseFloat(e.target.value) || 0)}
                              className="form-input text-xs pl-6"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-primary-600 mb-1">Tag</label>
                          <input
                            type="text"
                            value={transaction.tag}
                            onChange={(e) => handleEditTransaction(transaction.id, 'tag', e.target.value)}
                            className="form-input text-xs"
                            placeholder="e.g., Salary, Rent"
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-primary-600 mb-1">Description (optional)</label>
                        <input
                          type="text"
                          value={transaction.description || ''}
                          onChange={(e) => handleEditTransaction(transaction.id, 'description', e.target.value)}
                          className="form-input text-xs"
                          placeholder="Additional details..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRemoveTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Transaction Form */}
              {isAddingTransaction && (
                <div className="mt-3 bg-accent-50 rounded-lg p-4 border border-accent-200">
                  <h5 className="font-medium text-accent-800 mb-3 text-sm">Add New Transaction</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-primary-700 mb-1">Type</label>
                      <select
                        value={newTransaction.type}
                        onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })}
                        className="form-input text-sm"
                      >
                        <option value="income">Income (+)</option>
                        <option value="expense">Expense (-)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-primary-700 mb-1">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500 font-medium">$</span>
                        <input
                          type="number"
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
                          className="form-input text-sm pl-8"
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-primary-700 mb-1">Tag</label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {COMMON_TAGS[newTransaction.type].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setNewTransaction({ ...newTransaction, tag })}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            newTransaction.tag === tag
                              ? 'bg-accent-500 text-white'
                              : 'bg-background-200 text-primary-600 hover:bg-background-300'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={newTransaction.tag}
                      onChange={(e) => setNewTransaction({ ...newTransaction, tag: e.target.value })}
                      className="form-input text-sm"
                      placeholder="Or enter custom tag..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-primary-700 mb-1">Description (optional)</label>
                    <input
                      type="text"
                      value={newTransaction.description || ''}
                      onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      className="form-input text-sm"
                      placeholder="Additional details..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddTransaction}
                      className="btn-accent text-sm"
                      disabled={newTransaction.amount <= 0 || !newTransaction.tag.trim()}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAddingTransaction(false)}
                      className="btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">Notes</label>
              <textarea
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                className="form-input"
                rows={2}
                placeholder="Add any notes about this month..."
              />
            </div>
          </>
        ) : (
          <>
            {/* Summary View */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-background-200">
                <span className="text-sm text-primary-600 font-medium">Total Income:</span>
                <span className="text-sm font-bold text-green-600">
                  {formatCurrency(income)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-background-200">
                <span className="text-sm text-primary-600 font-medium">Total Expenses:</span>
                <span className="text-sm font-bold text-red-600">
                  {formatCurrency(expenses)}
                </span>
              </div>

              {/* Transactions by Tag */}
              {Object.keys(transactionsByTag).length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-medium text-primary-600 mb-2">By Category:</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {Object.entries(transactionsByTag).map(([tag, data]) => (
                      <div key={tag} className="flex justify-between items-center text-xs">
                        <span className="text-primary-600">{tag}:</span>
                        <span className={`font-medium ${
                          data.income > data.expense ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.income > 0 && data.expense > 0 
                            ? `+${formatCurrency(data.income)} / -${formatCurrency(data.expense)}`
                            : data.income > 0 
                              ? `+${formatCurrency(data.income)}`
                              : `-${formatCurrency(data.expense)}`
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {month.notes && (
                <div className="pt-3 border-t border-background-200">
                  <div className="text-sm text-primary-600 font-medium mb-1">Notes:</div>
                  <div className="text-sm text-primary-700 bg-background-50 rounded-lg p-3 leading-relaxed">
                    {month.notes}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-background-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-primary-700">Remaining:</span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            month.remainingFunds >= 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {formatCurrency(month.remainingFunds)}
          </span>
        </div>
      </div>
    </div>
  );
}