import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HelpCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import debounce from 'lodash/debounce';
import logo from '../assets/images/logo.png';

// Input Field Component
const InputField = ({ 
  label, 
  value, 
  onChange, 
  onBlur, 
  tooltip, 
  readOnly = false,
  error,
  className = "",
  helpText
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {tooltip && (
        <div className="relative group">
          <HelpCircle size={16} className="text-red-400 cursor-help" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-2 bg-gray-800 text-white text-xs sm:text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
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
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        aria-label={label}
        aria-invalid={!!error}
        className={`w-full pl-8 pr-4 py-2 border rounded-lg transition-colors
          ${readOnly ? 'bg-gray-50 text-gray-700' : 'bg-white'}
          ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-2 focus:ring-teal-500 focus:border-teal-500'}
          ${className}`}
      />
    </div>
    {error && (
      <p className="text-sm text-red-600" role="alert">{error}</p>
    )}
    {helpText && (
      <p className="text-xs text-gray-500 italic">{helpText}</p>
    )}
  </div>
);

// Saving Indicator Component
const SavingIndicator = ({ show }) => (
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
);

// Summary Section Component
const SummarySection = ({ summary }) => (
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

        <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(65, 191, 120, 0.19)' }}
        >
          <div className="text-sm font-medium text-gray-600 mb-1">TOTAL COSTS</div>
          <div className="text-2xl font-bold text-teal-700">${summary.totalCosts}</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-600 mb-1">TOTAL EXPENSES</div>
          <div className="text-2xl font-bold text-gray-700">${summary.totalExpenses}</div>
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
);

// Utility Functions
const formatCurrency = (value) => {
  const cleanValue = value.replace(/[^0-9.-]/g, '');
  if (!cleanValue || isNaN(cleanValue)) return '0.00';
  
  return Number(cleanValue).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const unformatCurrency = (value) => {
  return value.replace(/[^0-9.-]/g, '');
};

const validateNumber = (value) => {
  const num = parseFloat(unformatCurrency(value));
  if (isNaN(num)) return 'Please enter a valid number';
  if (num < 0) return 'Value cannot be negative';
  if (num > 999999999) return 'Value is too large';
  return null;
};
// Main CostsForm Component
const CostsForm = () => {
  const navigate = useNavigate();
  const [showSaving, setShowSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    inventory: {
      initialValue: '0.00',
      totalPurchases1: '0.00',
      totalPurchases2: '0.00',
      cogs: '0.00'
    },
    services: {
      cost: '0.00'
    }
  });

  // Summary state
  const [summary, setSummary] = useState({
    totalRevenue: '0.00',
    totalCosts: '0.00',
    totalExpenses: '0.00',
    netIncome: '0.00'
  });

  // Debounced save indicator
  const showSavingIndicator = debounce(() => {
    setShowSaving(true);
    setTimeout(() => setShowSaving(false), 1500);
  }, 300);

  // Handle input changes with validation
  const handleInputChange = (section, field, value) => {
    let numericValue = value.replace(/[^0-9.-]/g, '');
    
    const error = validateNumber(numericValue);
    setErrors(prev => ({
      ...prev,
      [`${section}.${field}`]: error
    }));

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: numericValue
      }
    }));

    showSavingIndicator();
  };

  // Handle blur event for formatting
  const handleInputBlur = (section, field, value) => {
    const formattedValue = formatCurrency(value);
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: formattedValue
      }
    }));
  };

  // Memoized COGS calculation
  const calculateCOGS = useMemo(() => {
    const initial = parseFloat(unformatCurrency(formData.inventory.initialValue)) || 0;
    const purchases = parseFloat(unformatCurrency(formData.inventory.totalPurchases1)) || 0;
    const final = parseFloat(unformatCurrency(formData.inventory.totalPurchases2)) || 0;
    
    return initial + purchases - final;
  }, [
    formData.inventory.initialValue, 
    formData.inventory.totalPurchases1, 
    formData.inventory.totalPurchases2
  ]);

  // Update COGS when values change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        cogs: formatCurrency(calculateCOGS.toString())
      }
    }));
  }, [calculateCOGS]);

  // Update totals when form data changes
  useEffect(() => {
    const calculateTotals = () => {
      const cogsCosts = parseFloat(unformatCurrency(formData.inventory.cogs)) || 0;
      const serviceCosts = parseFloat(unformatCurrency(formData.services.cost)) || 0;
      
      const totalCosts = cogsCosts + serviceCosts;

      setSummary(prev => ({
        ...prev,
        totalCosts: formatCurrency(totalCosts.toString()),
        netIncome: formatCurrency((
          parseFloat(unformatCurrency(prev.totalRevenue)) - 
          totalCosts - 
          parseFloat(unformatCurrency(prev.totalExpenses))
        ).toString())
      }));
    };

    calculateTotals();
  }, [formData]);

  const handleNavigation = (direction) => {
    setShowSaving(true);
    setTimeout(() => {
      setShowSaving(false);
      navigate(direction === 'next' ? '/TaxQuestions' : '/income');
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Costs Form - Tax Information</title>
        <meta name="description" content="Enter your company's costs and inventory information" />
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
              {/* Form Section */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Did your company have direct costs?
                  </h1>
                  <p className="text-base sm:text-lg text-gray-700">
                    Please input your information in the following fields:
                  </p>
                </div>

                {/* Inventory Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-lg space-y-4" style={{ backgroundColor: 'rgba(0, 151, 151, 0.24)' }}
                >
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    Inventory and Cost of Goods Sold
                  </h2>

                  <InputField
                    label="Inventory Value at the beginning of the year (Jan 1st, 2024)"
                    value={formData.inventory.initialValue}
                    onChange={(e) => handleInputChange('inventory', 'initialValue', e.target.value)}
                    onBlur={(e) => handleInputBlur('inventory', 'initialValue', e.target.value)}
                    tooltip="The total value of your inventory at the beginning of the year. This includes all products, materials, and goods in stock as of January 1st, 2024."
                    error={errors['inventory.initialValue']}
                  />

                  <InputField
                    label="Total Purchases in 2024"
                    value={formData.inventory.totalPurchases1}
                    onChange={(e) => handleInputChange('inventory', 'totalPurchases1', e.target.value)}
                    onBlur={(e) => handleInputBlur('inventory', 'totalPurchases1', e.target.value)}
                    tooltip="The total cost of all inventory purchases made during 2024, including raw materials, finished goods, and any other items added to your inventory."
                    error={errors['inventory.totalPurchases1']}
                  />

                  <InputField
                    label="Inventory Value at the end of the year (Dec 31st, 2024)"
                    value={formData.inventory.totalPurchases2}
                    onChange={(e) => handleInputChange('inventory', 'totalPurchases2', e.target.value)}
                    onBlur={(e) => handleInputBlur('inventory', 'totalPurchases2', e.target.value)}
                    tooltip="The total value of your inventory at the end of the year. This is the value of all remaining products, materials, and goods in stock as of December 31st, 2024"
                    error={errors['inventory.totalPurchases2']}
                  />

                  <InputField
                    label="Cost of Goods Sold"
                    value={formData.inventory.cogs}
                    readOnly
                    tooltip="Automatically calculated: Initial Inventory + Total Purchases - Final Inventory"
                    helpText="Initial Inventory + Total Purchases - Final Inventory"
                    className="bg-gray-50"
                  />
                </motion.div>

                {/* Services Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-lg space-y-4" style={{ backgroundColor: 'rgba(110, 64, 129, 0.3)' }}
                                  >
                  <h2 className="font-semibold text-gray-900">
                    Cost related to services
                  </h2>

                  <InputField
                    label="Cost of services provided"
                    value={formData.services.cost}
                    onChange={(e) => handleInputChange('services', 'cost', e.target.value)}
                    onBlur={(e) => handleInputBlur('services', 'cost', e.target.value)}
                    tooltip="The total direct costs incurred in providing services to customers, including labor, materials, and other direct service-related expenses."
                    error={errors['services.cost']}
                  />
                </motion.div>

                {/* Navigation */}
                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-600">Step 3 of 9</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-teal-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "33.3%" }}
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

        <SavingIndicator show={showSaving} />
      </div>
    </>
  );
};

export default CostsForm;
