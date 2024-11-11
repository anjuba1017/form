// src/pages/TransactionsForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const TransactionsForm = () => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate('/company-details');
  };
  
  const handleNext = () => {
    navigate('/transactions');
  };
  
  const [formData, setFormData] = useState({
    hasTransactions: '',
    firstTransaction: {
      transactionDescription: '',
      personType: '',
      personName: '',
      amountPaid: '0.00',
      amountReceived: '0.00',
      document: null
    },
    additionalTransactions: {
      hasMore: '',
      personType: '',
      personName: '',
      amountPaid: '0.00',
      amountReceived: '0.00',
      paymentReason: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleInputChange('firstTransaction', 'document', file);
  };

  const handleNumberInput = (section, field, value) => {
    // Remove non-numeric characters except decimal
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }

    handleInputChange(section, field, numericValue || '0.00');
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
        <div className="w-2/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Tell us more about your company
          </h1>

          <p className="text-lg text-gray-700 mb-8">
            Please input your information in the following fields:
          </p>

          <div className="space-y-8">
            {/* First Transaction Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  During 2023, were there any financial transactions between your U.S. company and any related party or partner entity outside U.S?
                </label>
                <input
                  type="text"
                  value={formData.firstTransaction.transactionDescription}
                  onChange={(e) => handleInputChange('firstTransaction', 'transactionDescription', e.target.value)}
                  placeholder="Text here"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Is the related party a Natural Person or a Legal Entity?
                </label>
                <input
                  type="text"
                  value={formData.firstTransaction.personType}
                  onChange={(e) => handleInputChange('firstTransaction', 'personType', e.target.value)}
                  placeholder="Text here"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  What is the name of the Natural Person/Legal Entity?
                </label>
                <input
                  type="text"
                  value={formData.firstTransaction.personName}
                  onChange={(e) => handleInputChange('firstTransaction', 'personName', e.target.value)}
                  placeholder="Text us here"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  What is the amount paid to this Individual/Legal Entity?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    value={formData.firstTransaction.amountPaid}
                    onChange={(e) => handleNumberInput('firstTransaction', 'amountPaid', e.target.value)}
                    className="w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  What was the amount received from the Individual/Legal Entity?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    value={formData.firstTransaction.amountReceived}
                    onChange={(e) => handleNumberInput('firstTransaction', 'amountReceived', e.target.value)}
                    className="w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Attach the Commercial Register from your country showing: Name, Address and Activity.
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="documentUpload"
                  />
                  <label
                    htmlFor="documentUpload"
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload size={20} />
                    {formData.firstTransaction.document 
                      ? formData.firstTransaction.document.name 
                      : "Click here to upload a document file"}
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Transactions Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Did you have transactions with different persons/companies?
                  Please complete the field below with the remaining information.
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="yes"
                      checked={formData.additionalTransactions.hasMore === 'yes'}
                      onChange={(e) => handleInputChange('additionalTransactions', 'hasMore', 'yes')}
                      className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                    />
                    <span>Yes</span>
                    <span className="text-gray-500 text-sm ml-1">I did have transactions</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="no"
                      checked={formData.additionalTransactions.hasMore === 'no'}
                      onChange={(e) => handleInputChange('additionalTransactions', 'hasMore', 'no')}
                      className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                    />
                    <span>No</span>
                    <span className="text-gray-500 text-sm ml-1">No, I did not.</span>
                  </label>
                </div>
              </div>

              {formData.additionalTransactions.hasMore === 'yes' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Is the related party a Natural Person or a Legal Entity?
                    </label>
                    <input
                      type="text"
                      value={formData.additionalTransactions.personType}
                      onChange={(e) => handleInputChange('additionalTransactions', 'personType', e.target.value)}
                      placeholder="Text us here"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      What is the name of the Natural Person/Legal Entity?
                    </label>
                    <input
                      type="text"
                      value={formData.additionalTransactions.personName}
                      onChange={(e) => handleInputChange('additionalTransactions', 'personName', e.target.value)}
                      placeholder="Text us here"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      What is the amount paid to this Individual/Legal Entity?
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={formData.additionalTransactions.amountPaid}
                        onChange={(e) => handleNumberInput('additionalTransactions', 'amountPaid', e.target.value)}
                        className="w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      What was the amount received from the Individual/Legal Entity?
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={formData.additionalTransactions.amountReceived}
                        onChange={(e) => handleNumberInput('additionalTransactions', 'amountReceived', e.target.value)}
                        className="w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      What was the reason for the payment? Ex: Initial bank account deposit, purchase of goods for resale, services, etc.
                    </label>
                    <input
                      type="text"
                      value={formData.additionalTransactions.paymentReason}
                      onChange={(e) => handleInputChange('additionalTransactions', 'paymentReason', e.target.value)}
                      placeholder="Text us here"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Progress and Navigation */}
          <div className="mt-12">
            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">Step 1 of 4</div>
              <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                <div className="w-1/4 h-full bg-teal-500 rounded-full"></div>
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

        {/* Right Column - Info Box */}
        <div className="w-1/3">
          <div className="bg-teal-50 p-8 rounded-lg">
            <img src={logo} alt="Company Logo" className="w-12 h-12 mb-6" />
            <blockquote className="text-lg text-gray-700">
              ANY TEXT OR INFORMATION TO HELP THE CUSTOMER HERE......
            </blockquote>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionsForm;