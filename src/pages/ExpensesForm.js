import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, X, Trash2, HelpCircle, Undo, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import debounce from 'lodash/debounce';
import logo from '../assets/images/logo.png';

// Constants
const INITIAL_EXPENSES = [
  { id: 1, description: 'Advertising', amount: '0.00' },
  { id: 2, description: 'Accounting', amount: '0.00' },
  { id: 3, description: 'Bank services charges (card fees)', amount: '0.00' },
  { id: 4, description: 'Company fees and licenses', amount: '0.00' },
  { id: 5, description: 'Consulting services', amount: '0.00' },
  { id: 6, description: 'Globalfy plan subscription', amount: '0.00' },
  { id: 7, description: 'Interest expenses', amount: '0.00' },
  { id: 8, description: 'Administrative expenses', amount: '0.00' }
];

// Utility functions
const formatNumber = (value) => {
  const cleanValue = value.replace(/,/g, '');
  if (!cleanValue || isNaN(cleanValue)) return '0.00';
  
  return Number(cleanValue).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const unformatNumber = (value) => value.replace(/,/g, '');

const formatCurrencyWhileTyping = (value) => {
  let number = value.replace(/[^\d.]/g, '');
  const parts = number.split('.');
  if (parts.length > 2) number = parts[0] + '.' + parts.slice(1).join('');
  if (parts[1]?.length > 2) {
    number = parts[0] + '.' + parts[1].slice(0, 2);
  }
  return number;
};

// Create debounced saving indicator outside component
const createDebouncedSavingIndicator = (setShowSaving) => 
  debounce(() => {
    setShowSaving(true);
    setTimeout(() => setShowSaving(false), 1500);
  }, 300);


// Currency Input Component
const CurrencyInput = memo(React.forwardRef(({ 
  label, 
  value, 
  onChange, 
  onBlur, 
  error, 
  required = false,
  className = "" 
}, ref) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <span 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        aria-hidden="true"
      >
        $
      </span>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e, formatCurrencyWhileTyping(e.target.value))}
        onBlur={onBlur}
        className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}`}
        aria-label={`${label} in dollars`}
        aria-invalid={!!error}
        required={required}
      />
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
)));

// Saving Indicator Component
const SavingIndicator = memo(({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 z-50"
        role="status"
        aria-live="polite"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Save className="w-5 h-5 text-teal-600" />
        </motion.div>
        <span className="text-gray-700 text-sm sm:text-base">Saving your progress...</span>
      </motion.div>
    )}
  </AnimatePresence>
));
// Modal Component
const AddExpenseModal = memo(({ isOpen, onClose, onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const initialFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    modalElement.addEventListener('keydown', handleKeyDown);
    initialFocusRef.current?.focus();

    // Save previous active element to restore focus when modal closes
    const previousActiveElement = document.activeElement;
    return () => {
      modalElement.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    onAdd({ description, amount: formatNumber(amount) });
    setDescription('');
    setAmount('0.00');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-lg w-full max-w-2xl mx-4 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 id="modal-title" className="text-xl sm:text-2xl font-bold">
            Add New Expense
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 sm:mb-8 bg-gray-50 p-4 sm:p-6 rounded-lg">
          <h4 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2 sm:mb-3">
            What to include
          </h4>
          <p className="text-base sm:text-lg leading-relaxed text-gray-600">
            Business expenses do not include <span className="text-red-500 font-medium">rent</span>,{' '}
            <span className="text-red-500 font-medium">partner salaries</span>, or any payments
            made from or received of a partner's personal account. Additionally,{' '}
            <span className="text-red-500 font-medium">federal tax payments</span> cannot be
            included as business expenses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              ref={initialFocusRef}
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError('');
              }}
              className={`w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              aria-invalid={!!error}
              aria-describedby={error ? 'description-error' : undefined}
            />
            {error && (
              <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>

          <CurrencyInput
            label="Amount"
            value={amount}
            onChange={(e, value) => setAmount(value)}
            onBlur={() => setAmount(formatNumber(amount))}
            required
          />

          <div className="flex flex-col sm:flex-row-reverse gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 text-base font-medium bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Add Expense
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 text-base font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
});

// Expense Row Component
const ExpenseRow = memo(({ expense, onAmountChange, onAmountBlur, onRemove }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      onRemove(expense.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="listitem"
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
            onChange={(e) => onAmountChange(expense.id, formatCurrencyWhileTyping(e.target.value))}
            onBlur={() => onAmountBlur(expense.id)}
            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            aria-label={`Amount for ${expense.description}`}
          />
        </div>
      </div>
      <button
        onClick={() => onRemove(expense.id)}
        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
        aria-label={`Remove ${expense.description}`}
      >
        <Trash2 size={20} />
      </button>
    </motion.div>
  );
});
// Summary Section Component
const SummarySection = memo(({ summary }) => (
  <div className="lg:sticky lg:top-6" style={{ height: 'fit-content' }}>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
        2024 NET INCOME SUMMARY
      </h2>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-600 mb-1">TOTAL REVENUE</div>
          <div className="text-2xl font-bold text-gray-700">${summary.totalRevenue}</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-600 mb-1">TOTAL COSTS</div>
          <div className="text-2xl font-bold text-gray-700">${summary.totalCosts}</div>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(65, 191, 120, 0.19)' }}>
          <div className="text-sm font-medium text-gray-600 mb-1">TOTAL EXPENSES</div>
          <div className="text-2xl font-bold text-teal-700">${summary.totalExpenses}</div>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(65, 191, 120, 0.19)' }}>
          <div className="text-sm font-medium text-gray-600 mb-1">NET INCOME</div>
          <div className="text-2xl font-bold text-teal-700">${summary.netIncome}</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  </div>
));

// Main Component
const ExpensesForm = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [deletedExpenses, setDeletedExpenses] = useState([]);
  const [showSaving, setShowSaving] = useState(false);
  const [summary, setSummary] = useState({
    totalRevenue: '0.00',
    totalCosts: '0.00',
    totalExpenses: '0.00',
    netIncome: '0.00'
  });

  // Create a ref for the debounced saving indicator
  const debouncedSavingIndicatorRef = useRef(createDebouncedSavingIndicator(setShowSaving));

  const handleAddExpense = useCallback((newExpense) => {
    setExpenses(prev => [...prev, {
      id: Math.max(...prev.map(e => e.id), 0) + 1,
      ...newExpense
    }]);
    debouncedSavingIndicatorRef.current();
  }, []);

  const handleRemoveExpense = useCallback((id) => {
    setExpenses(prev => {
      const expense = prev.find(e => e.id === id);
      setDeletedExpenses(deleted => [...deleted, expense]);
      return prev.filter(e => e.id !== id);
    });
    debouncedSavingIndicatorRef.current();
  }, []);

  const handleUndo = useCallback(() => {
    setDeletedExpenses(prev => {
      const lastDeleted = prev[prev.length - 1];
      setExpenses(expenses => [...expenses, lastDeleted]);
      return prev.slice(0, -1);
    });
    debouncedSavingIndicatorRef.current();
  }, []);

  const handleAmountChange = useCallback((id, value) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === id ? { ...exp, amount: value } : exp
    ));
    debouncedSavingIndicatorRef.current();
  }, []);

  const handleAmountBlur = useCallback((id) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === id ? { ...exp, amount: formatNumber(exp.amount) } : exp
    ));
  }, []);

  const handleNavigation = useCallback((direction) => {
    setShowSaving(true);
    setTimeout(() => {
      setShowSaving(false);
      navigate(direction === 'next' ? '/partners' : '/TaxQuestions');
    }, 1500);
  }, [navigate]);

  // Update summary when expenses change
  useEffect(() => {
    const totalExpenses = expenses.reduce((sum, expense) => 
      sum + (parseFloat(unformatNumber(expense.amount)) || 0), 0
    );

    setSummary(prev => ({
      ...prev,
      totalExpenses: formatNumber(totalExpenses.toString()),
      netIncome: formatNumber((
        parseFloat(unformatNumber(prev.totalRevenue)) - 
        parseFloat(unformatNumber(prev.totalCosts)) - 
        totalExpenses
      ).toString())
    }));
  }, [expenses]);

  return (
    <>
      <Helmet>
        <title>Expenses Form - Tax Information</title>
        <meta name="description" content="Enter your company's expenses information" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <header className="bg-white border-b border-gray-200 py-4 px-4">
          <div className="max-w-7xl mx-auto">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="h-8 w-auto"
            />
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Did your company have related expenses?
                  </h1>
                  <p className="text-base sm:text-lg text-gray-700">
                    Please add your information in the following fields::
                  </p>
                </div>

                {/* Add New Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 text-teal-500 hover:text-teal-600 px-4 py-2 border border-teal-500 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <Plus size={20} />
                  Add New Expense
                </button>

                {/* Undo Button */}
                {deletedExpenses.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={handleUndo}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <Undo size={16} />
                    Undo last deletion
                  </motion.button>
                )}

                {/* Expenses List */}
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {expenses.map((expense) => (
                      <ExpenseRow
                        key={expense.id}
                        expense={expense}
                        onAmountChange={handleAmountChange}
                        onAmountBlur={handleAmountBlur}
                        onRemove={handleRemoveExpense}
                      />
                    ))}
                  </AnimatePresence>
                  {expenses.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-gray-500"
                    >
                      No expenses added yet
                    </motion.div>
                  )}
                </div>

                {/* Progress and Navigation */}
                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-600">Step 5 of 9</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-teal-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "55%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => handleNavigation('prev')}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-purple-600 text-white flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
                    >
                      <ArrowLeft size={20} />
                      Previous
                    </button>
                    <button 
                      onClick={() => handleNavigation('next')}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-600 text-white flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors"
                    >
                      Next
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <SummarySection summary={summary} />
            </div>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <AddExpenseModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAdd={handleAddExpense}
            />
          )}
        </AnimatePresence>

        {/* Saving Indicator */}
        <SavingIndicator show={showSaving} />
      </div>
    </>
  );
};

export default ExpensesForm;