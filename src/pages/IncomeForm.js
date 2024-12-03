import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Trash2, HelpCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import logo from '../assets/images/logo.png';

// Helper functions remain the same
const formatNumber = (value) => {
  const cleanValue = value.replace(/,/g, '');
  if (!cleanValue || isNaN(cleanValue)) return '0.00';
  
  return Number(cleanValue).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const unformatNumber = (value) => {
  return value.replace(/,/g, '');
};

const SavingIndicator = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 max-w-[calc(100%-2rem)] mx-4 z-50"
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
);

const InputField = ({ label, value, onChange, onBlur, tooltip }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {tooltip && (
        <div className="relative group">
          <HelpCircle size={16} className="text-red-400 cursor-help" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs sm:text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
            {tooltip}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e)}
        onBlur={onBlur}
        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        aria-label={label}
      />
    </div>
  </div>
);

const AddIncomeModal = ({ isOpen, onClose, onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    if (parseFloat(unformatNumber(amount)) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    onAdd({ description, amount: formatNumber(amount) });
    setDescription('');
    setAmount('0.00');
    setError('');
    onClose();
  };

  const handleAmountChange = (value) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }

    setAmount(numericValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Other Income</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

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
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={() => setAmount(formatNumber(amount))}
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
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const IncomeForm = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSaving, setShowSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    services: '0.00',
    products: '0.00',
    interest: '0.00'
  });

  const [otherIncomes, setOtherIncomes] = useState([]);

  const [summary, setSummary] = useState({
    totalRevenue: '0.00',
    totalCosts: '0.00',
    totalExpenses: '0.00',
    netIncome: '0.00'
  });

  // Handlers remain the same...
  const handleInputChange = (field, value) => {
    setShowSaving(true);
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }

    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));

    setTimeout(() => setShowSaving(false), 1500);
  };

  const handleInputBlur = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: formatNumber(prev[field])
    }));
  };

  const handleAddIncome = (newIncome) => {
    setShowSaving(true);
    setOtherIncomes(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      ...newIncome
    }]);
    setTimeout(() => setShowSaving(false), 1500);
  };

  const handleRemoveIncome = (id) => {
    setShowSaving(true);
    setOtherIncomes(prev => prev.filter(income => income.id !== id));
    setTimeout(() => setShowSaving(false), 1500);
  };

  useEffect(() => {
    const calculateTotal = () => {
      const mainIncome = Object.values(formData).reduce(
        (sum, value) => sum + (parseFloat(unformatNumber(value)) || 0), 0
      );

      const otherIncomesTotal = otherIncomes.reduce(
        (sum, income) => sum + (parseFloat(unformatNumber(income.amount)) || 0), 0
      );

      const totalRevenue = mainIncome + otherIncomesTotal;

      setSummary(prev => ({
        ...prev,
        totalRevenue: formatNumber(totalRevenue.toString()),
        netIncome: formatNumber((totalRevenue - (
          parseFloat(unformatNumber(prev.totalCosts)) + 
          parseFloat(unformatNumber(prev.totalExpenses))
        )).toString())
      }));
    };

    calculateTotal();
  }, [formData, otherIncomes]);

  const handleNavigation = (direction) => {
    setShowSaving(true);
    setTimeout(() => {
      setShowSaving(false);
      navigate(direction === 'next' ? '/costs' : '/');
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Income Form - Tax Information</title>
        <meta name="description" content="Enter your company's income information for tax purposes" />
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Did your company have income?
                  </h1>
                  <p className="text-base text-gray-700">
                    Please provide the{' '}
                    <span className="text-green-500 font-bold">company income related to sales,</span>{' '}
                    <span className="text-red-500 font-bold">do not include member's contributions</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <InputField 
                    label="Services (intangible)"
                    value={formData.services}
                    onChange={(e) => handleInputChange('services', e.target.value)}
                    onBlur={() => handleInputBlur('services')}
                    tooltip="Income from services provided to customers, such as consulting, maintenance, repairs, or any non-physical product delivery"
                  />

                  <InputField 
                    label="Products (Tangible)"
                    value={formData.products}
                    onChange={(e) => handleInputChange('products', e.target.value)}
                    onBlur={() => handleInputBlur('products')}
                    tooltip="Income from selling physical goods or products to customers, including manufactured items, resale goods, or any tangible merchandise"
                  />
                  <InputField 
                    label="Interest revenue"
                    value={formData.interest}
                    onChange={(e) => handleInputChange('interest', e.target.value)}
                    onBlur={() => handleInputBlur('interest')}
                    tooltip="Income earned from interest-bearing accounts, investments, loans provided, or other financial instruments generating interest."
                  />

                  {/* Other Income Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-medium text-gray-900">Other Income</h2>
                      <div className="relative group">
                        <HelpCircle size={16} className="text-red-400 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                          Any additional income that doesn't fit into the above categories, such as rental income, royalties, or commissions.
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
                    >
                      <Plus size={20} />
                      Add a new item
                    </button>

                    {otherIncomes.map((income) => (
                      <div 
                        key={income.id}
                        className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {income.description}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="text"
                              value={income.amount}
                              onChange={(e) => handleInputChange(income.id, e.target.value)}
                              onBlur={() => handleInputBlur(income.id)}
                              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveIncome(income.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="py-6">
                  <div className="flex items-center mb-4">
                    <div className="text-sm text-gray-500">Step 2 of 9</div>
                    <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: "22.22%" }}
                      ></div>
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

              {/* Right Column - Summary */}
              <div className="lg:sticky lg:top-6" style={{ height: 'fit-content' }}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    2024 NET INCOME SUMMARY
                  </h2>

                  <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(65, 191, 120, 0.19)' }}>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        TOTAL INCOME
                      </div>
                      <div className="text-2xl font-bold text-teal-700">
                        ${summary.totalRevenue}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        TOTAL COSTS
                      </div>
                      <div className="text-2xl font-bold text-gray-700">
                        ${summary.totalCosts}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        TOTAL EXPENSES
                      </div>
                      <div className="text-2xl font-bold text-gray-700">
                        ${summary.totalExpenses}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(65, 191, 120, 0.19)' }}>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                        NET INCOME
                      </div>
                      <div className="text-2xl font-bold text-teal-700">
                        ${summary.netIncome}
                      </div>
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
            </div>
          </div>
        </div>

        <SavingIndicator show={showSaving} />

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <AddIncomeModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAdd={handleAddIncome}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default IncomeForm;