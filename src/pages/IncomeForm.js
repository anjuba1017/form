// src/pages/IncomeForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const IncomeForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    services: '0.00',
    products: '0.00',
    interest: '0.00',
    other: '0.00',
    otherDescription: ''
  });

  // Summary state
  const [summary, setSummary] = useState({
    totalRevenue: '0.00',
    totalCosts: '0.00',
    totalExpenses: '0.00',
    netIncome: '0.00'
  });

  // Handle numeric input changes with formatting
  const handleInputChange = (field, value) => {
    // Remove non-numeric characters except decimal
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Format to 2 decimal places if there's a decimal point
    if (numericValue.includes('.')) {
      const [whole, decimal] = numericValue.split('.');
      numericValue = whole + '.' + (decimal || '').slice(0, 2);
    }

    // Update form data
    setFormData(prev => ({
      ...prev,
      [field]: numericValue || '0.00'
    }));
  };

  // Calculate totals when form data changes
  useEffect(() => {
    const calculateTotal = () => {
      const totalRevenue = [
        parseFloat(formData.services) || 0,
        parseFloat(formData.products) || 0,
        parseFloat(formData.interest) || 0,
        parseFloat(formData.other) || 0
      ].reduce((a, b) => a + b, 0);

      setSummary(prev => ({
        ...prev,
        totalRevenue: totalRevenue.toFixed(2),
        netIncome: (totalRevenue - (parseFloat(prev.totalCosts) + parseFloat(prev.totalExpenses))).toFixed(2)
      }));
    };

    calculateTotal();
  }, [formData]);

  // Navigation handlers
  const handlePrevious = () => {
    navigate('/');
  };

  const handleNext = () => {
    navigate('/costs');
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
            What income did your company have?
          </h1>

          <p className="text-lg text-gray-700 mb-8">
            Please input your information in the following fields:
          </p>

          <div className="space-y-6">
            {/* Services Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Services (intangible)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={formData.services}
                  onChange={(e) => handleInputChange('services', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Products Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Products (Tangibles)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={formData.products}
                  onChange={(e) => handleInputChange('products', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Interest Revenue Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Interest revenue
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={formData.interest}
                  onChange={(e) => handleInputChange('interest', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Other Income Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Other Income
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={formData.other}
                  onChange={(e) => handleInputChange('other', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Other Income Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                If you have other type of income, please specify it
              </label>
              <textarea
                value={formData.otherDescription}
                onChange={(e) => setFormData(prev => ({...prev, otherDescription: e.target.value}))}
                placeholder="Write here the other income..."
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 h-24 resize-none"
              />
            </div>
          </div>

          {/* Progress and Navigation */}
          <div className="mt-12">
            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">Step 2 of 4</div>
              <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                <div className="w-1/2 h-full bg-teal-500 rounded-full"></div>
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
            <div className="flex justify-between p-4 bg-teal-50 rounded-lg">
              <span className="font-medium">TOTAL REVENUE</span>
              <span className="font-medium">${summary.totalRevenue}</span>
            </div>

            <div className="flex justify-between p-4 bg-white rounded-lg">
              <span className="font-medium">TOTAL COSTS</span>
              <span className="font-medium">${summary.totalCosts}</span>
            </div>

            <div className="flex justify-between p-4 bg-white rounded-lg">
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

export default IncomeForm;