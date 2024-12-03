import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Paperclip, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/images/logo.png';

// Helper Components
const Tooltip = ({ text }) => (
  <div className="relative group">
    <HelpCircle 
      size={20} 
      className="text-red-400 cursor-help"
      aria-label="Help information"
    />
    <div
      role="tooltip" 
      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 sm:w-80 p-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10"
    >
      {text}
      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
    </div>
  </div>
);

const RadioOption = ({ checked, onChange, label, description, name, value }) => (
  <label 
    className={`block p-4 rounded-lg border cursor-pointer transition-all
      ${checked ? 'bg-teal-50 border-teal-500' : 'border-gray-200 hover:bg-gray-50'}`}
  >
    <div className="flex items-center">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={() => onChange(value)}
        className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
      />
      <div className="ml-3">
        <span className={`font-medium ${checked ? 'text-teal-900' : 'text-gray-900'}`}>
          {label}
        </span>
        <p className={`text-sm ${checked ? 'text-teal-700' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>
    </div>
  </label>
);

const FileUpload = ({ id, file, onFileChange, label }) => {
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
      onFileChange(selectedFile);
    } else {
      alert('File size should be less than 5MB');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          id={id}
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label
          htmlFor={id}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <Paperclip size={16} className="mr-2" />
          {file ? file.name : 'Upload file'}
        </label>
        {file && (
          <button
            onClick={() => onFileChange(null)}
            className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Supported formats: PDF, JPG, PNG (max 5MB)
      </p>
    </div>
  );
};

const MoneyInput = ({ label, value, onChange, onBlur }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
        aria-label={`${label} in dollars`}
      />
    </div>
  </div>
);

// Utility functions
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

// Main Component
const TaxQuestionsForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    stateTax: {
      paid: null,
      amount: '0.00',
      file: null
    },
    form1099: {
      contracted: null,
      amount: '0.00',
      file: null
    }
  });

  const [summary, setSummary] = useState({
    totalRevenue: '0.00',
    totalCosts: '0.00',
    totalExpenses: '0.00',
    netIncome: '0.00'
  });

  const handleAmountChange = (field, value) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }

    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        amount: numericValue
      }
    }));

    updateSummary();
  };

  const handleAmountBlur = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        amount: formatNumber(prev[field].amount)
      }
    }));

    updateSummary();
  };

  const updateSummary = () => {
    const stateTaxAmount = parseFloat(unformatNumber(formData.stateTax.amount)) || 0;
    const form1099Amount = parseFloat(unformatNumber(formData.form1099.amount)) || 0;
    const totalExpenses = stateTaxAmount + form1099Amount;

    setSummary(prev => ({
      ...prev,
      totalExpenses: formatNumber(totalExpenses.toString()),
      netIncome: formatNumber((
        parseFloat(unformatNumber(prev.totalRevenue)) - 
        parseFloat(unformatNumber(prev.totalCosts)) - 
        totalExpenses
      ).toString())
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex flex-col"
    >
      {/* Logo Section */}
      <header className="p-4 sm:p-8 border-b">
        <div className="w-10 h-10 sm:w-12 sm:h-12">
          <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Did your company have related expenses?
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                 Please add your information in the following fields:.
                </p>
              </div>

              {/* State/Local Tax Section */}
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <h2 className="text-lg font-semibold">
                    Did you pay any state or local tax?
                  </h2>
                  <Tooltip text="State and local taxes are separate from federal taxes and are paid to your state or local government. These may include state income tax, sales tax, or other local business taxes." />
                </div>

                <div className="space-y-3">
                  <RadioOption
                    checked={formData.stateTax.paid === true}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      stateTax: { ...prev.stateTax, paid: value }
                    }))}
                    label="Yes"
                    description="I did pay taxes last year"
                    name="stateTax"
                    value={true}
                  />

                  <RadioOption
                    checked={formData.stateTax.paid === false}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      stateTax: { ...prev.stateTax, paid: value }
                    }))}
                    label="No"
                    description="I did not pay any tax last year"
                    name="stateTax"
                    value={false}
                  />

                  <AnimatePresence>
                    {formData.stateTax.paid === true && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-7 space-y-4 pt-4"
                      >
                        <MoneyInput
                          label="If yes, how much did you pay?"
                          value={formData.stateTax.amount}
                          onChange={(e) => handleAmountChange('stateTax', e.target.value)}
                          onBlur={() => handleAmountBlur('stateTax')}
                        />

                        <FileUpload
                          id="stateTaxFile"
                          file={formData.stateTax.file}
                          onFileChange={(file) => setFormData(prev => ({
                            ...prev,
                            stateTax: { ...prev.stateTax, file }
                          }))}
                          label="Upload the payment receipt of your taxes"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Form 1099 Section */}
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <h2 className="text-lg font-semibold">
                    Did you make any payment in the last year that required you to file the 1099 form?
                  </h2>
                  <Tooltip text="Form 1099 is required when you pay $600 or more to a US-based independent contractor or service provider in a calendar year. This includes freelancers, consultants, or other non-employee services." />
                </div>

                <div className="space-y-3">
                  <RadioOption
                    checked={formData.form1099.contracted === true}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      form1099: { ...prev.form1099, contracted: value }
                    }))}
                    label="Yes"
                    description="I contracted services"
                    name="form1099"
                    value={true}
                  />

                  <RadioOption
                    checked={formData.form1099.contracted === false}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      form1099: { ...prev.form1099, contracted: value }
                    }))}
                    label="No"
                    description="No, I did not"
                    name="form1099"
                    value={false}
                  />

                  <AnimatePresence>
                    {formData.form1099.contracted === true && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-7 space-y-4 pt-4"
                      >
                        <MoneyInput
                          label="If yes, how much did you pay?"
                          value={formData.form1099.amount}
                          onChange={(e) => handleAmountChange('form1099', e.target.value)}
                          onBlur={() => handleAmountBlur('form1099')}
                        />

                        <FileUpload
                          id="form1099File"
                          file={formData.form1099.file}
                          onFileChange={(file) => setFormData(prev => ({
                            ...prev,
                            form1099: { ...prev.form1099, file }
                          }))}
                          label="Upload your 1099 form"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress and Navigation */}
              <div className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="text-sm text-gray-500">Step 4 of 9</div>
                  <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                    <motion.div
                      className="h-full bg-teal-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "44.44%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => navigate('/costs')}
                    className="w-full sm:w-auto px-6 py-2 rounded-lg bg-purple-600 text-white flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
                  >
                    <ArrowLeft size={20} />
                    Previous
                  </button>
                  <button 
                    onClick={() => navigate('/expenses')}
                    className="w-full sm:w-auto px-6 py-2 rounded-lg bg-teal-500 text-white flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors"
                  >
                    Next
                    <ArrowRight size={20} />
                  </button>
                  </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="w-full">
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
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaxQuestionsForm;