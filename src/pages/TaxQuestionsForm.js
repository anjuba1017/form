// src/pages/TaxQuestionsForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

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

  // Summary state
  const [summary, setSummary] = useState({
    totalRevenue: '0.00',
    totalCosts: '0.00',
    totalExpenses: '0.00',
    netIncome: '0.00'
  });

  const handleAmountChange = (field, value) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    if (numericValue.includes('.')) {
      const [whole, decimal] = numericValue.split('.');
      numericValue = whole + '.' + (decimal || '').slice(0, 2);
    }
  
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        amount: numericValue || '0.00'
      }
    }));
  
  // Update total expenses in summary
  setSummary(prev => {
    const stateTaxAmount = field === 'stateTax' ? 
      parseFloat(numericValue) || 0 : 
      parseFloat(formData.stateTax.amount) || 0;
    
    const form1099Amount = field === 'form1099' ? 
      parseFloat(numericValue) || 0 : 
      parseFloat(formData.form1099.amount) || 0;

    const totalExpenses = stateTaxAmount + form1099Amount;

    return {
      ...prev,
      totalExpenses: totalExpenses.toFixed(2),
      netIncome: (
        parseFloat(prev.totalRevenue) - 
        parseFloat(prev.totalCosts) - 
        totalExpenses
      ).toFixed(2)
    };
  });
  };


  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        file: file
      }
    }));
  };

  const handlePrevious = () => {
    navigate('/costs');
  };
  
  const handleNext = () => {
    navigate('/expenses');
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

          {/* State/Local Tax Section */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">
              Did you pay any state or local tax?
            </h2>
            
            <div className="space-y-3">
              <label className={`block p-4 rounded-lg border cursor-pointer transition-all
                ${formData.stateTax.paid === true ? 'bg-teal-50 border-teal-500' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stateTax"
                    checked={formData.stateTax.paid === true}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      stateTax: { ...prev.stateTax, paid: true }
                    }))}
                    className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <span className={`font-medium ${formData.stateTax.paid === true ? 'text-teal-900' : 'text-gray-900'}`}>
                      Yes
                    </span>
                    <p className={`text-sm ${formData.stateTax.paid === true ? 'text-teal-700' : 'text-gray-500'}`}>
                      I did pay taxes last year
                    </p>
                  </div>
                </div>
              </label>

              <label className={`block p-4 rounded-lg border cursor-pointer transition-all
                ${formData.stateTax.paid === false ? 'bg-teal-50 border-teal-500' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="stateTax"
                    checked={formData.stateTax.paid === false}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      stateTax: { ...prev.stateTax, paid: false }
                    }))}
                    className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <span className={`font-medium ${formData.stateTax.paid === false ? 'text-teal-900' : 'text-gray-900'}`}>
                      No
                    </span>
                    <p className={`text-sm ${formData.stateTax.paid === false ? 'text-teal-700' : 'text-gray-500'}`}>
                      I did not pay any tax last year
                    </p>
                  </div>
                </div>
              </label>

              {/* Conditional Fields for State Tax */}
              {formData.stateTax.paid === true && (
                <div className="ml-7 space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      If yes, how much did you pay?
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={formData.stateTax.amount}
                        onChange={(e) => handleAmountChange('stateTax', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Choose the file to upload the payment receipt of your taxes
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange('stateTax', e.target.files[0])}
                        className="hidden"
                        id="stateTaxFile"
                      />
                      <label
                        htmlFor="stateTaxFile"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <Paperclip size={16} className="mr-2" />
                        {formData.stateTax.file ? formData.stateTax.file.name : 'Upload file'}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form 1099 Section */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">
              Did you contract a service within the U.S? Form 1099
            </h2>
            
            <div className="space-y-3">
              <label className={`block p-4 rounded-lg border cursor-pointer transition-all
                ${formData.form1099.contracted === true ? 'bg-teal-50 border-teal-500' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="form1099"
                    checked={formData.form1099.contracted === true}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      form1099: { ...prev.form1099, contracted: true }
                    }))}
                    className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <span className={`font-medium ${formData.form1099.contracted === true ? 'text-teal-900' : 'text-gray-900'}`}>
                      Yes
                    </span>
                    <p className={`text-sm ${formData.form1099.contracted === true ? 'text-teal-700' : 'text-gray-500'}`}>
                      I contracted services
                    </p>
                  </div>
                </div>
              </label>

              <label className={`block p-4 rounded-lg border cursor-pointer transition-all
                ${formData.form1099.contracted === false ? 'bg-teal-50 border-teal-500' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="form1099"
                    checked={formData.form1099.contracted === false}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      form1099: { ...prev.form1099, contracted: false }
                    }))}
                    className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <span className={`font-medium ${formData.form1099.contracted === false ? 'text-teal-900' : 'text-gray-900'}`}>
                      No
                    </span>
                    <p className={`text-sm ${formData.form1099.contracted === false ? 'text-teal-700' : 'text-gray-500'}`}>
                      No, I did not.
                    </p>
                  </div>
                </div>
              </label>

              {/* Conditional Fields for Form 1099 */}
              {formData.form1099.contracted === true && (
                <div className="ml-7 space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      If yes, how much did you pay?
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={formData.form1099.amount}
                        onChange={(e) => handleAmountChange('form1099', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Choose the file to upload form
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange('form1099', e.target.files[0])}
                        className="hidden"
                        id="form1099File"
                      />
                      <label
                        htmlFor="form1099File"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <Paperclip size={16} className="mr-2" />
                        {formData.form1099.file ? formData.form1099.file.name : 'Upload file'}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress and Navigation */}
          <div className="mt-12">
            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">Step 3 of 4</div>
              <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                <div className="w-3/4 h-full bg-teal-500 rounded-full"></div>
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

export default TaxQuestionsForm;