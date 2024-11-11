// src/pages/ExpensesForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/images/logo.png';

// Modal Component
const AddExpenseModal = ({ isOpen, onClose, onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0.00');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ description, amount });
    setDescription('');
    setAmount('0.00');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Expense</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  if (value.split('.').length <= 2) {
                    setAmount(value);
                  }
                }}
                className="w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Add Expense
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ExpensesForm = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initial expenses list
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Advertising', amount: '0.00' },
    { id: 2, description: 'Accounting', amount: '0.00' },
    { id: 3, description: 'Bank services charges (card fees)', amount: '0.00' },
    { id: 4, description: 'Company fees and licenses', amount: '0.00' },
    { id: 5, description: 'Consulting services', amount: '0.00' },
    { id: 6, description: 'State or local taxes', amount: '0.00' },
    { id: 7, description: 'Interest expenses', amount: '0.00' },
    { id: 8, description: 'Administrative expenses', amount: '0.00' }
  ]);

  // Summary state
  const [summary, setSummary] = useState({
    totalRevenue: '0.00',
    totalCosts: '0.00',
    totalExpenses: '0.00',
    netIncome: '0.00'
  });

  // Handle amount change for existing expenses
  const handleAmountChange = (id, value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, amount: numericValue } : expense
    ));
  };

  // Handle adding new expense
  const handleAddExpense = (newExpense) => {
    setExpenses(prev => [...prev, {
      id: Math.max(...prev.map(e => e.id)) + 1,
      description: newExpense.description,
      amount: newExpense.amount
    }]);
  };

  // Handle removing expense
  const handleRemoveExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  // Calculate totals when expenses change
  useEffect(() => {
    const totalExpenses = expenses.reduce((sum, expense) => 
      sum + (parseFloat(expense.amount) || 0), 0
    );

    setSummary(prev => ({
      ...prev,
      totalExpenses: totalExpenses.toFixed(2),
      netIncome: (
        parseFloat(prev.totalRevenue) - 
        parseFloat(prev.totalCosts) - 
        totalExpenses
      ).toFixed(2)
    }));
  }, [expenses]);

  const handlePrevious = () => {
    navigate('/costs');
  };

  const handleNext = () => {
    navigate('/partners');
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex flex-col"
    >
      <AnimatePresence>
        {isModalOpen && (
          <AddExpenseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddExpense}
          />
        )}
      </AnimatePresence>

      {/* Logo Section */}
      <div className="p-8 border-b">
        <div className="w-12 h-12">
          <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-8 py-12 gap-8">
        {/* Left Column - Form */}
        <div className="w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            What expenses did your company have?
          </h1>

          <p className="text-lg text-gray-700 mb-8">
            Please input your information in the following fields:
          </p>

          {/* Add New Item Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-teal-500 hover:text-teal-600 mb-6"
          >
            <Plus size={20} />
            Add a new item
          </button>

          {/* Expenses List */}
          <div className="max-h-[400px] overflow-y-auto pr-4 space-y-4">
            {expenses.map((expense) => (
              <div 
                key={expense.id}
                className="flex items-center gap-4"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {expense.description}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={expense.amount}
                      onChange={(e) => handleAmountChange(expense.id, e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveExpense(expense.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors mt-6"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Progress and Navigation */}
          <div className="mt-12">
            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">Step 4 of 4</div>
              <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                <div className="w-full h-full bg-teal-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handlePrevious}
                className="px-6 py-2 rounded-lg bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <ArrowLeft size={20} />
                Previous
              </button>
              <button 
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-teal-500 text-white flex items-center gap-2 hover:bg-teal-600 transition-colors"
              >
                Next
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="w-1/2 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            2023 SUMMARY NET INCOME
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between p-4 bg-white rounded-lg">
              <span className="font-medium">TOTAL REVENUE</span>
              <span className="font-medium">${summary.totalRevenue}</span>
            </div>

            <div className="flex justify-between p-4 bg-white rounded-lg">
              <span className="font-medium">TOTAL COSTS</span>
              <span className="font-medium">${summary.totalCosts}</span>
            </div>

            <div className="flex justify-between p-4 bg-teal-50 rounded-lg">
              <span className="font-medium">TOTAL EXPENSES</span>
              <span className="font-medium">${summary.totalExpenses}</span>
            </div>

            <div className="flex justify-between p-4 bg-teal-50 rounded-lg mt-8">
              <span className="font-medium">NET INCOME</span>
              <span className="font-medium">${summary.netIncome}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpensesForm;