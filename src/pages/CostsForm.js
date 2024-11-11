// src/pages/CostsForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const CostsForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    inventory: {
      initialValue: '0.00',
      totalPurchases1: '0.00',
      totalPurchases2: '0.00'
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

  // Handle numeric input changes with formatting
  const handleInputChange = (section, field, value) => {
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
      [section]: {
        ...prev[section],
        [field]: numericValue || '0.00'
      }
    }));
  };

  // Calculate totals when form data changes
  useEffect(() => {
    const calculateTotalCosts = () => {
      const inventoryCosts = parseFloat(formData.inventory.initialValue) +
        parseFloat(formData.inventory.totalPurchases1) +
        parseFloat(formData.inventory.totalPurchases2);
      
      const serviceCosts = parseFloat(formData.services.cost);
      
      const totalCosts = inventoryCosts + serviceCosts;

      setSummary(prev => ({
        ...prev,
        totalCosts: totalCosts.toFixed(2),
        netIncome: (parseFloat(prev.totalRevenue) - totalCosts - parseFloat(prev.totalExpenses)).toFixed(2)
      }));
    };

    calculateTotalCosts();
  }, [formData]);

  const handlePrevious = () => {
    navigate('/income');
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
            What costs did your company have?
          </h1>

          <p className="text-lg text-gray-700 mb-8">
            Please input your information in the following fields:
          </p>

          <div className="space-y-8">
            {/* Inventory and Cost of Goods Sold Section */}
            <div className="bg-teal-50 p-6 rounded-lg space-y-4">
              <h2 className="font-semibold text-gray-900">
                Inventory and Cost of Goods Sold
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Initial Inventory Value (01 Jan 2023)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={formData.inventory.initialValue}
                      onChange={(e) => handleInputChange('inventory', 'initialValue', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Purchases in 2023
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={formData.inventory.totalPurchases1}
                      onChange={(e) => handleInputChange('inventory', 'totalPurchases1', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Final Inventory Value (31 Dec 2023)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={formData.inventory.totalPurchases2}
                      onChange={(e) => handleInputChange('inventory', 'totalPurchases2', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Related to Services Section */}
            <div className="bg-purple-50 p-6 rounded-lg space-y-4">
              <h2 className="font-semibold text-gray-900">
                Cost related to services
              </h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cost of services provided
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    value={formData.services.cost}
                    onChange={(e) => handleInputChange('services', 'cost', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
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
            <div className="flex justify-between p-4 bg-teal-50 rounded-lg">
              <span className="font-medium">TOTAL REVENUE</span>
              <span className="font-medium">${summary.totalRevenue}</span>
            </div>

            <div className="flex justify-between p-4 bg-teal-50 rounded-lg">
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

export default CostsForm;