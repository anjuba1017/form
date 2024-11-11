// src/pages/BalanceForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const BalanceForm = () => {
  const navigate = useNavigate();
  
  // Form state for current year balances
  const [assets, setAssets] = useState({
    bankBalance: '0.00',
    otherBankAccount: '0.00',
    prepaidExpenses: '0.00',
    durableGoods: '0.00'
  });

  const [liabilities, setLiabilities] = useState({
    accountsPayable: '0.00',
    financing: '0.00',
    otherLoans: '0.00',
    paymentsInAdvance: '0.00'
  });

  // Summary totals
  const [summary, setSummary] = useState({
    totalAssets: '0.00',
    totalLiabilities: '0.00'
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
    if (section === 'assets') {
      setAssets(prev => ({
        ...prev,
        [field]: numericValue || '0.00'
      }));
    } else {
      setLiabilities(prev => ({
        ...prev,
        [field]: numericValue || '0.00'
      }));
    }
  };

  // Calculate totals when values change
  useEffect(() => {
    const calculateTotals = () => {
      const totalAssets = Object.values(assets).reduce(
        (sum, value) => sum + parseFloat(value), 0
      );

      const totalLiabilities = Object.values(liabilities).reduce(
        (sum, value) => sum + parseFloat(value), 0
      );

      setSummary({
        totalAssets: totalAssets.toFixed(2),
        totalLiabilities: totalLiabilities.toFixed(2)
      });
    };

    calculateTotals();
  }, [assets, liabilities]);

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
        <div className="w-2/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Tell us more about your company
          </h1>

          <p className="text-lg text-gray-700 mb-8">
            Please input your information in the following fields:
          </p>

          {/* 2023 Closing Balance Section */}
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900">
              2023 CLOSING BALANCE
            </h2>

            {/* Assets Section */}
            <div className="bg-teal-50 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900">ASSETS</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Bank Balance (Under the American Company's Name)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={assets.bankBalance}
                      onChange={(e) => handleInputChange('assets', 'bankBalance', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other company's bank account
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={assets.otherBankAccount}
                      onChange={(e) => handleInputChange('assets', 'otherBankAccount', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prepaid expenses or security deposits
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={assets.prepaidExpenses}
                      onChange={(e) => handleInputChange('assets', 'prepaidExpenses', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durable goods
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={assets.durableGoods}
                      onChange={(e) => handleInputChange('assets', 'durableGoods', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Liabilities Section */}
            <div className="bg-purple-50 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900">LIABILITIES</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accounts payable to suppliers
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={liabilities.accountsPayable}
                      onChange={(e) => handleInputChange('liabilities', 'accountsPayable', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Financing
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={liabilities.financing}
                      onChange={(e) => handleInputChange('liabilities', 'financing', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other loans
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={liabilities.otherLoans}
                      onChange={(e) => handleInputChange('liabilities', 'otherLoans', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payments received in advance
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={liabilities.paymentsInAdvance}
                      onChange={(e) => handleInputChange('liabilities', 'paymentsInAdvance', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress and Navigation */}
          <div className="mt-12">
            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">Step 6 of 6</div>
              <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                <div className="w-full h-full bg-teal-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/partners')}
                className="px-6 py-2 rounded-lg bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <ArrowLeft size={20} />
                Previous
              </button>
              <button 
                onClick={() => navigate('/company-details')}
                className="px-6 py-2 rounded-lg bg-teal-500 text-white flex items-center gap-2 hover:bg-teal-600 transition-colors"
              >
                Next
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="w-1/3">
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex items-start mb-8">
              <img src={logo} alt="Company Logo" className="w-12 h-12" />
              <h2 className="text-xl font-bold ml-4">LAST YEAR CLOSING BALANCE</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <span className="font-medium">TOTAL ASSETS</span>
                <span className="font-medium">${summary.totalAssets}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <span className="font-medium">TOTAL LIABILITIES</span>
                <span className="font-medium">${summary.totalLiabilities}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceForm;