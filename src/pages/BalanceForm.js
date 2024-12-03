import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, HelpCircle, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';
import { saveFormProgress, loadFormProgress } from '../utils/session';
import logo from '../assets/images/logo.png';

const BalanceForm = () => {
  const navigate = useNavigate();
  
  const [assets, setAssets] = useState({
    bankBalance: '0.00',
    otherBankAccount: '0.00',
    prepaidExpenses: '0.00',
    durableGoods: '0.00',
    pendingAccounts: '0.00',
    others: []
  });

  const [liabilities, setLiabilities] = useState({
    accountsPayable: '0.00',
    financing: '0.00',
    otherLoans: '0.00',
    paymentsInAdvance: '0.00'
  });

  const [summary, setSummary] = useState({
    totalAssets: '0.00',
    totalLiabilities: '0.00',
    netBalance: '0.00'
  });

  // Focus state for better visibility
  const [focusedField, setFocusedField] = useState(null);
  const [showSaving, setShowSaving] = useState(false);

  // Load saved progress when component mounts
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedProgress = await loadFormProgress();
        if (savedProgress?.balance) {
          setAssets(savedProgress.balance.assets);
          setLiabilities(savedProgress.balance.liabilities);
          setSummary(savedProgress.balance.summary);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    };

    loadSavedData();
  }, []);

  // Auto-save whenever form data changes
  const saveProgress = debounce(async () => {
    try {
      setShowSaving(true);
      await saveFormProgress({
        balance: {
          assets,
          liabilities,
          summary,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setTimeout(() => setShowSaving(false), 1000);
    }
  }, 1000);

  useEffect(() => {
    saveProgress();
    return () => saveProgress.cancel();
  }, [assets, liabilities]);

  const formatNumber = (value) => {
    const cleanValue = value.replace(/,/g, '');
    if (!cleanValue || isNaN(cleanValue)) return '0.00';
    
    return Number(cleanValue).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleInputChange = (section, field, value) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }

    if (section === 'assets') {
      setAssets(prev => ({
        ...prev,
        [field]: numericValue
      }));
    } else {
      setLiabilities(prev => ({
        ...prev,
        [field]: numericValue
      }));
    }
  };

  const handleBlur = (section, field, value) => {
    const formattedValue = formatNumber(value);
    if (section === 'assets') {
      setAssets(prev => ({
        ...prev,
        [field]: formattedValue
      }));
    } else {
      setLiabilities(prev => ({
        ...prev,
        [field]: formattedValue
      }));
    }
    setFocusedField(null);
  };

  const handleAddOtherAsset = () => {
    setAssets(prev => ({
      ...prev,
      others: [...prev.others, { description: '', amount: '0.00' }]
    }));
  };

  const handleUpdateOtherAsset = (index, field, value) => {
    setAssets(prev => ({
      ...prev,
      others: prev.others.map((item, i) => 
        i === index ? { ...item, [field]: field === 'amount' ? value : value } : item
      )
    }));
  };

  const handleRemoveOtherAsset = (index) => {
    setAssets(prev => ({
      ...prev,
      others: prev.others.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    const calculateTotals = () => {
      const otherAssetsTotal = assets.others.reduce(
        (sum, item) => sum + parseFloat(item.amount.replace(/,/g, '') || '0'), 0
      );

      const totalAssets = Object.entries(assets).reduce(
        (sum, [key, value]) => {
          if (key !== 'others') {
            return sum + parseFloat(value.replace(/,/g, '') || '0');
          }
          return sum;
        }, 0
      ) + otherAssetsTotal;

      const totalLiabilities = Object.values(liabilities).reduce(
        (sum, value) => sum + parseFloat(value.replace(/,/g, '') || '0'), 0
      );

      const netBalance = totalAssets - totalLiabilities;

      setSummary({
        totalAssets: formatNumber(totalAssets.toString()),
        totalLiabilities: formatNumber(totalLiabilities.toString()),
        netBalance: formatNumber(netBalance.toString())
      });
    };

    calculateTotals();
  }, [assets, liabilities]);

  const handleNavigation = (direction) => {
    setShowSaving(true);
    setTimeout(() => {
      setShowSaving(false);
      navigate(direction === 'next' ? '/company-details' : '/partners');
    }, 1500);
  };

  // Common input styles with focus indicators
  const inputStyles = (fieldName) => `
    w-full pl-8 pr-4 py-3 bg-white border rounded-lg
    focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none
    ${focusedField === fieldName ? 'ring-2 ring-teal-500 border-teal-500' : 'border-gray-300'}
    transition-all duration-200
  `;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="w-12 h-12">
            <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Step 7 of 9</div>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: "77.7%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tell us more about your company
              </h1>
              <p className="text-lg text-gray-700">
                Please input your information in the following fields:
              </p>
            </div>

            {/* Assets Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                2024 CLOSING BALANCE
              </h2>

              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                ASSETS
              </h2>
              
              <div className="space-y-6">
                {/* Bank Balance */}
                <div className="relative group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                    Total Bank Balance
                    <HelpCircle size={16} className="text-red-400 cursor-help" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      Total amount in all bank accounts registered under your US company name
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={assets.bankBalance}
                      onChange={(e) => handleInputChange('assets', 'bankBalance', e.target.value)}
                      onFocus={() => setFocusedField('bankBalance')}
                      onBlur={(e) => handleBlur('assets', 'bankBalance', e.target.value)}
                      className={inputStyles('bankBalance')}
                      aria-label="Total Bank Balance"
                    />
                  </div>
                </div>

                {/* Other Bank Account */}
                <div className="relative group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                    Other Company's Bank Account
                    <HelpCircle size={16} className="text-red-400 cursor-help" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      Balance in bank accounts registered under different company names
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={assets.otherBankAccount}
                      onChange={(e) => handleInputChange('assets', 'otherBankAccount', e.target.value)}
                      onFocus={() => setFocusedField('otherBankAccount')}
                      onBlur={(e) => handleBlur('assets', 'otherBankAccount', e.target.value)}
                      className={inputStyles('otherBankAccount')}
                      aria-label="Other Company's Bank Account"
                    />
                  </div>
                </div>

                {/* Pending Accounts */}
                <div className="relative group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                    Pending Accounts from Customers
                    <HelpCircle size={16} className="text-red-400 cursor-help" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      Outstanding payments that customers owe to your company
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={assets.pendingAccounts}
                      onChange={(e) => handleInputChange('assets', 'pendingAccounts', e.target.value)}
                      onFocus={() => setFocusedField('pendingAccounts')}
                      onBlur={(e) => handleBlur('assets', 'pendingAccounts', e.target.value)}
                      className={inputStyles('pendingAccounts')}
                      aria-label="Pending Accounts from Customers"
                    />
                  </div>
                </div>

                {/* Prepaid Expenses */}
                <div className="relative group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
                    Prepaid Expenses or Deposits
                    <HelpCircle size={16} className="text-red-400 cursor-help" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      Expenses paid in advance and deposits held by other parties
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
value={assets.prepaidExpenses}
onChange={(e) => handleInputChange('assets', 'prepaidExpenses', e.target.value)}
onFocus={() => setFocusedField('prepaidExpenses')}
onBlur={(e) => handleBlur('assets', 'prepaidExpenses', e.target.value)}
className={inputStyles('prepaidExpenses')}
aria-label="Prepaid Expenses or Deposits"
/>
</div>
</div>

{/* Durable Goods */}
<div className="relative group">
<label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
Durable Goods
<HelpCircle size={16} className="text-red-400 cursor-help" />
<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
Long-lasting equipment, furniture, or other physical assets
<div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
</div>
</label>
<div className="relative">
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
<input
type="text"
value={assets.durableGoods}
onChange={(e) => handleInputChange('assets', 'durableGoods', e.target.value)}
onFocus={() => setFocusedField('durableGoods')}
onBlur={(e) => handleBlur('assets', 'durableGoods', e.target.value)}
className={inputStyles('durableGoods')}
aria-label="Durable Goods"
/>
</div>
</div>

{/* Other Assets Section */}
<div className="space-y-4">
{assets.others.map((item, index) => (
<div key={index} className="flex gap-4 items-start">
<div className="flex-1">
  <input
    type="text"
    value={item.description}
    onChange={(e) => handleUpdateOtherAsset(index, 'description', e.target.value)}
    placeholder="Asset Description"
    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
    aria-label={`Other Asset ${index + 1} Description`}
  />
</div>
<div className="relative w-48">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
  <input
    type="text"
    value={item.amount}
    onChange={(e) => handleUpdateOtherAsset(index, 'amount', e.target.value)}
    onBlur={(e) => handleUpdateOtherAsset(index, 'amount', formatNumber(e.target.value))}
    className="w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
    aria-label={`Other Asset ${index + 1} Amount`}
  />
</div>
<button
  onClick={() => handleRemoveOtherAsset(index)}
  className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
  aria-label={`Remove Other Asset ${index + 1}`}
>
  <X size={20} />
</button>
</div>
))}
<button
onClick={handleAddOtherAsset}
className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium p-2 rounded-lg hover:bg-teal-50 transition-colors"
>
<Plus size={20} />
Add Other Asset
</button>
</div>
</div>
</div>

{/* Liabilities Section */}
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
<h2 className="text-xl font-semibold text-gray-900">LIABILITIES</h2>

<div className="space-y-6">
{/* Accounts Payable */}
<div className="relative group">
<label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
Accounts Payable to Suppliers
<HelpCircle size={16} className="text-red-400 cursor-help" />
<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
Money owed to suppliers for goods or services received
<div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
</div>
</label>
<div className="relative">
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
<input
type="text"
value={liabilities.accountsPayable}
onChange={(e) => handleInputChange('liabilities', 'accountsPayable', e.target.value)}
onFocus={() => setFocusedField('accountsPayable')}
onBlur={(e) => handleBlur('liabilities', 'accountsPayable', e.target.value)}
className={inputStyles('accountsPayable')}
aria-label="Accounts Payable to Suppliers"
/>
</div>
</div>

{/* Financing */}
<div className="relative group">
<label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
Financing
<HelpCircle size={16} className="text-red-400 cursor-help" />
<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
Outstanding balances on business loans or credit lines
<div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
</div>
</label>
<div className="relative">
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
<input
type="text"
value={liabilities.financing}
onChange={(e) => handleInputChange('liabilities', 'financing', e.target.value)}
onFocus={() => setFocusedField('financing')}
onBlur={(e) => handleBlur('liabilities', 'financing', e.target.value)}
className={inputStyles('financing')}
aria-label="Financing"
/>
</div>
</div>

{/* Other Loans */}
<div className="relative group">
<label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
Other Loans
<HelpCircle size={16} className="text-red-400 cursor-help" />
<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
Additional loans not included in main financing
<div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
</div>
</label>
<div className="relative">
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
<input
type="text"
value={liabilities.otherLoans}
onChange={(e) => handleInputChange('liabilities', 'otherLoans', e.target.value)}
onFocus={() => setFocusedField('otherLoans')}
onBlur={(e) => handleBlur('liabilities', 'otherLoans', e.target.value)}
className={inputStyles('otherLoans')}
aria-label="Other Loans"
/>
</div>
</div>

{/* Payments in Advance */}
<div className="relative group">
<label className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-2">
Payments Received in Advance
<HelpCircle size={16} className="text-red-400 cursor-help" />
<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
Customer payments received for goods or services not yet delivered
<div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
</div>
</label>
<div className="relative">
<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
<input
type="text"
value={liabilities.paymentsInAdvance}
onChange={(e) => handleInputChange('liabilities', 'paymentsInAdvance', e.target.value)}
onFocus={() => setFocusedField('paymentsInAdvance')}
onBlur={(e) => handleBlur('liabilities', 'paymentsInAdvance', e.target.value)}
className={inputStyles('paymentsInAdvance')}
aria-label="Payments Received in Advance"
/>
</div>
</div>
</div>
</div>

{/* Navigation Buttons */}
<div className="flex gap-4 pt-6">
<button 
onClick={() => handleNavigation('prev')}
className="px-6 py-3 rounded-lg bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
>
<ArrowLeft size={20} />
Previous
</button>
<button 
onClick={() => handleNavigation('next')}
className="px-6 py-3 rounded-lg bg-teal-600 text-white flex items-center gap-2 hover:bg-teal-700 transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
>
Next
<ArrowRight size={20} />
</button>
</div>
</div>

{/* Summary Section */}
<div className="lg:col-span-1">
<div className="sticky top-8">
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
<div className="flex items-center gap-4 pb-4 border-b border-gray-100">
<img src={logo} alt="Company Logo" className="w-10 h-10" />
<h2 className="text-xl font-bold text-gray-900">2024 SUMMARY</h2>
</div>

<div className="space-y-4">
<div className="p-4 bg-teal-50 rounded-lg">
<div className="text-sm font-medium text-gray-600 mb-1">TOTAL ASSETS</div>
<div className="text-2xl font-bold text-teal-700">${summary.totalAssets}</div>
</div>

<div className="p-4 bg-purple-50 rounded-lg">
<div className="text-sm font-medium text-gray-600 mb-1">TOTAL LIABILITIES</div>
<div className="text-2xl font-bold text-purple-700">${summary.totalLiabilities}</div>
</div>

<div className="p-4 bg-gray-900 rounded-lg">
<div className="text-sm font-medium text-gray-300 mb-1">NET BALANCE</div>
<div className="text-2xl font-bold text-white">${summary.netBalance}</div>
</div>
</div>

<div className="pt-4 border-t border-gray-100">
<div className="text-sm text-gray-500">
Last updated: {new Date().toLocaleString([], { 
hour: '2-digit', 
minute: '2-digit', 
year: 'numeric', 
month: 'numeric', 
day: 'numeric' 
})}
</div>
</div>
</div>
</div>
</div>
</div>
</div>

{/* Saving Indicator */}
<AnimatePresence>
{showSaving && (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 z-50"
>
<Save className="w-5 h-5 text-teal-600" />
<span className="text-gray-700">Saving your progress...</span>
</motion.div>
)}
</AnimatePresence>
</motion.div>
);
};

export default BalanceForm;