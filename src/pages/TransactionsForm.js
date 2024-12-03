import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  HelpCircle, 
  Building2, 
  User, 
  DollarSign, 
  FileText,
  CheckCircle2,
  XCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const tooltipContent = {
  transactions: {
    title: "Financial Transactions",
    description: "Information about financial transactions between your U.S. company and related parties outside the U.S. during 2023.",
    examples: [
      "Payments to foreign suppliers",
      "Receipts from foreign customers",
      "Loans to/from related parties",
      "Capital contributions"
    ],
    tips: [
      "Include all transactions regardless of size",
      "Report amounts in U.S. dollars",
      "Keep supporting documentation ready",
      "Include both incoming and outgoing transactions"
    ]
  },
  partyType: {
    title: "Related Party Type",
    description: "Specify whether the related party is an individual (Natural Person) or a company (Legal Entity).",
    examples: [
      "Natural Person: Individual shareholders, directors, or officers",
      "Legal Entity: Foreign parent company, subsidiary, or affiliate"
    ],
    tips: [
      "Choose 'Natural Person' for individuals",
      "Select 'Legal Entity' for companies",
      "Be consistent with official documentation",
      "If unsure, check the party's tax status"
    ]
  },
  documents: {
    title: "Required Documentation",
    description: "Upload official documentation showing the related party's details.",
    examples: [
      "Commercial Register extract",
      "Business license",
      "Corporate registration documents",
      "Official company documents"
    ],
    tips: [
      "Documents should be in PDF format",
      "Maximum file size: 10MB",
      "Ensure documents are current",
      "Include certified translations if not in English"
    ]
  }
};

const allowedFileTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const maxFileSize = 10 * 1024 * 1024; // 10MB

const TransactionsForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [focusedField, setFocusedField] = useState(null);
  const [uploadError, setUploadError] = useState('');
  
  const [formData, setFormData] = useState({
    hasTransactions: null,
    firstTransaction: {
      transactionDescription: '',
      personType: '',
      personName: '',
      amountPaid: '0.00',
      amountReceived: '0.00',
      document: null,
      documentName: ''
    },
    additionalTransactions: {
      hasMore: null,
      personType: '',
      personName: '',
      amountPaid: '0.00',
      amountReceived: '0.00',
      paymentReason: ''
    }
  });

  const [contextualHelp, setContextualHelp] = useState({
    title: 'Transactions Information',
    description: 'Report financial transactions with related parties outside the U.S.',
    examples: [],
    tips: []
  });

  // Format number with commas and two decimal places
  const formatNumber = (value) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    if (!cleanValue || isNaN(cleanValue)) return '0.00';
    
    return Number(cleanValue).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberInput = (section, field, value) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }

    handleInputChange(section, field, numericValue);
  };

  const handleNumberBlur = (section, field, value) => {
    const formattedValue = formatNumber(value);
    handleInputChange(section, field, formattedValue);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadError('');

    if (file) {
      if (!allowedFileTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please upload PDF, Word, or image files.');
        return;
      }

      if (file.size > maxFileSize) {
        setUploadError('File size exceeds 10MB limit.');
        return;
      }

      handleInputChange('firstTransaction', 'document', file);
      handleInputChange('firstTransaction', 'documentName', file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!allowedFileTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please upload PDF, Word, or image files.');
        return;
      }

      if (file.size > maxFileSize) {
        setUploadError('File size exceeds 10MB limit.');
        return;
      }

      handleInputChange('firstTransaction', 'document', file);
      handleInputChange('firstTransaction', 'documentName', file.name);
    }
  };

  const updateContextualHelp = (field) => {
    const content = tooltipContent[field] || {
      title: 'Transactions Information',
      description: 'Report financial transactions with related parties outside the U.S.',
      examples: [],
      tips: []
    };

    setContextualHelp(content);
  };

  const inputStyles = (fieldName) => `
    w-full p-3 bg-white border rounded-lg
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
            <div className="text-sm text-gray-600">Step 9 of 9</div>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: "100%" }}
              ></div>
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
                Financial Transactions
              </h1>
              <p className="text-lg text-gray-700">
                Please provide information about your company's financial transactions:
              </p>
            </div>

            {/* First Question Container */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-teal-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Primary Transaction Information</h2>
                </div>

                {/* Main Question */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-800">
                      During 2023, were there any financial transactions between your U.S. company and any related party or partner entity outside U.S?
                    </label>
                    <div className="relative group">
                      <HelpCircle
                        size={16}
                        className="text-gray-400 cursor-help"
                        onMouseEnter={() => updateContextualHelp('transactions')}
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                        <div className="font-medium mb-1">Report all financial transactions with related parties outside the U.S.</div>
                        <div className="text-gray-300 text-xs">Include payments, receipts, loans, and capital contributions</div>
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="yes"
                        checked={formData.hasTransactions === 'yes'}
                        onChange={() => handleRadioChange('hasTransactions', 'yes')}
                        className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="no"
                        checked={formData.hasTransactions === 'no'}
                        onChange={() => handleRadioChange('hasTransactions', 'no')}
                        className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* Transaction Details */}
                {formData.hasTransactions === 'yes' && (
                  <div className="space-y-6 pt-6 border-t border-gray-200">
                    {/* Transaction Description */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          Transaction Description
                        </label>
                      </div>
                      <textarea
                        value={formData.firstTransaction.transactionDescription}
                        onChange={(e) => handleInputChange('firstTransaction', 'transactionDescription', e.target.value)}
                        onFocus={() => {
                          setFocusedField('transactionDescription');
                          updateContextualHelp('transactions');
                        }}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Describe the nature of the transaction..."
                        className={`${inputStyles('transactionDescription')} min-h-[100px] resize-none`}
                      />
                    </div>

                    {/* Person Type */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          Related Party Type
                        </label>
                        <div className="relative group">
                          <HelpCircle
                            size={16}
                            className="text-gray-400 cursor-help"
                            onMouseEnter={() => updateContextualHelp('partyType')}
                          />
                        </div>
                      </div>
                      <select
                        value={formData.firstTransaction.personType}
                        onChange={(e) => handleInputChange('firstTransaction', 'personType', e.target.value)}
                        className={inputStyles('personType')}
                      >
                        <option value="">Select type...</option>
                        <option value="natural">Natural Person</option>
                        <option value="legal">Legal Entity</option>
                      </select>
                    </div>

                    {/* Person/Entity Name */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          {formData.firstTransaction.personType === 'natural' 
                            ? 'Person Name' 
                            : 'Entity Name'}
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formData.firstTransaction.personName}
                        onChange={(e) => handleInputChange('firstTransaction', 'personName', e.target.value)}
                        onFocus={() => setFocusedField('personName')}
                        onBlur={() => setFocusedField(null)}
                        placeholder={formData.firstTransaction.personType === 'natural' 
                          ? "Enter person's full name" 
                          : "Enter legal entity name"
                        }
                        className={inputStyles('personName')}
                      />
                    </div>

                    {/* Amount Paid */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          Amount Paid to {formData.firstTransaction.personType === 'natural' ? 'Individual' : 'Entity'}
                        </label>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          value={formData.firstTransaction.amountPaid}
                          onChange={(e) => handleNumberInput('firstTransaction', 'amountPaid', e.target.value)}
                          onFocus={() => setFocusedField('amountPaid')}
                          onBlur={(e) => {
                            handleNumberBlur('firstTransaction', 'amountPaid', e.target.value);
                            setFocusedField(null);
                          }}
                          className={`${inputStyles('amountPaid')} pl-8`}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Amount Received */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          Amount Received from {formData.firstTransaction.personType === 'natural' ? 'Individual' : 'Entity'}
                        </label>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          value={formData.firstTransaction.amountReceived}
                          onChange={(e) => handleNumberInput('firstTransaction', 'amountReceived', e.target.value)}
                          onFocus={() => setFocusedField('amountReceived')}
                          onBlur={(e) => {
                            handleNumberBlur('firstTransaction', 'amountReceived', e.target.value);
                            setFocusedField(null);
                          }}
                          className={`${inputStyles('amountReceived')} pl-8`}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Upload className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          Upload Supporting Documentation
                        </label>
                        <div className="relative group">
                          <HelpCircle
                            size={16}
                            className="text-gray-400 cursor-help"
                            onMouseEnter={() => updateContextualHelp('documents')}
                          />
                        </div>
                      </div>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors cursor-pointer hover:border-teal-500"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <div className="flex flex-col items-center text-gray-600">
                          {formData.firstTransaction.document ? (
                            <>
                              <CheckCircle2 size={24} className="text-teal-500 mb-2" />
                              <p className="text-sm font-medium text-teal-600">{formData.firstTransaction.documentName}</p>
                              <p className="text-xs text-gray-500 mt-1">Click or drag to replace</p>
                            </>
                          ) : (
                            <>
                              <Upload size={24} className="mb-2" />
                              <p className="text-sm font-medium">Click or drag file to upload</p>
                              <p className="text-xs text-gray-500 mt-1">PDF, Word, or Image files up to 10MB</p>
                            </>
                          )}
                        </div>
                      </div>
                      {uploadError && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                          <XCircle size={14} />
                          {uploadError}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Second Question Container */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-teal-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Additional Transactions</h2>
                </div>

                {/* Second Question */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-800">
                      Did you have transactions with different persons/companies?
                    </label>
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="yes"
                        checked={formData.additionalTransactions.hasMore === 'yes'}
                        onChange={() => handleInputChange('additionalTransactions', 'hasMore', 'yes')}
                        className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                        disabled={formData.hasTransactions !== 'yes'}
                      />
                      <span className={`text-gray-700 ${formData.hasTransactions !== 'yes' ? 'opacity-50' : ''}`}>
                        Yes, I had more transactions
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="no"
                        checked={formData.additionalTransactions.hasMore === 'no'}
                        onChange={() => handleInputChange('additionalTransactions', 'hasMore', 'no')}
                        className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                        disabled={formData.hasTransactions !== 'yes'}
                      />
                      <span className={`text-gray-700 ${formData.hasTransactions !== 'yes' ? 'opacity-50' : ''}`}>
                      No additional transactions
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Transaction Fields */}
                {formData.additionalTransactions.hasMore === 'yes' && (
                  <div className="space-y-6 pt-6 border-t border-gray-200">
                    {/* Person Type */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          Related Party Type
                        </label>
                      </div>
                      <select
                        value={formData.additionalTransactions.personType}
                        onChange={(e) => handleInputChange('additionalTransactions', 'personType', e.target.value)}
                        className={inputStyles('additionalPersonType')}
                      >
                        <option value="">Select type...</option>
                        <option value="natural">Natural Person</option>
                        <option value="legal">Legal Entity</option>
                      </select>
                    </div>

                    {/* Person/Entity Name */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          {formData.additionalTransactions.personType === 'natural' 
                            ? 'Person Name' 
                            : 'Entity Name'}
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formData.additionalTransactions.personName}
                        onChange={(e) => handleInputChange('additionalTransactions', 'personName', e.target.value)}
                        onFocus={() => setFocusedField('additionalPersonName')}
                        onBlur={() => setFocusedField(null)}
                        placeholder={formData.additionalTransactions.personType === 'natural' 
                          ? "Enter person's full name" 
                          : "Enter legal entity name"
                        }
                        className={inputStyles('additionalPersonName')}
                      />
                    </div>

                    {/* Amount Paid */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          Amount Paid
                        </label>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          value={formData.additionalTransactions.amountPaid}
                          onChange={(e) => handleNumberInput('additionalTransactions', 'amountPaid', e.target.value)}
                          onFocus={() => setFocusedField('additionalAmountPaid')}
                          onBlur={(e) => {
                            handleNumberBlur('additionalTransactions', 'amountPaid', e.target.value);
                            setFocusedField(null);
                          }}
                          className={`${inputStyles('additionalAmountPaid')} pl-8`}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Amount Received */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          Amount Received
                        </label>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          value={formData.additionalTransactions.amountReceived}
                          onChange={(e) => handleNumberInput('additionalTransactions', 'amountReceived', e.target.value)}
                          onFocus={() => setFocusedField('additionalAmountReceived')}
                          onBlur={(e) => {
                            handleNumberBlur('additionalTransactions', 'amountReceived', e.target.value);
                            setFocusedField(null);
                          }}
                          className={`${inputStyles('additionalAmountReceived')} pl-8`}
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Payment Reason */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="text-teal-600" size={20} />
                        <label className="text-sm font-medium text-gray-800">
                          Reason for Payment
                        </label>
                      </div>
                      <textarea
                        value={formData.additionalTransactions.paymentReason}
                        onChange={(e) => handleInputChange('additionalTransactions', 'paymentReason', e.target.value)}
                        onFocus={() => setFocusedField('paymentReason')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Ex: Initial bank account deposit, purchase of goods for resale, services, etc."
                        className={`${inputStyles('paymentReason')} min-h-[100px] resize-none`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/company-details')}
                className="px-6 py-3 rounded-lg bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
              >
                <ArrowLeft size={20} />
                Previous
              </button>
              <button 
                className="px-6 py-3 rounded-lg bg-teal-600 text-white flex items-center gap-2 hover:bg-teal-700 transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Right Column - Contextual Help */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <img src={logo} alt="Company Logo" className="w-10 h-10" />
                  <h2 className="text-xl font-bold text-gray-900">{contextualHelp.title}</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {contextualHelp.description}
                    </p>
                  </div>
                  
                  {contextualHelp.examples?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900">Examples:</h3>
                      <ul className="space-y-2">
                        {contextualHelp.examples.map((example, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-teal-500 mt-1">•</span>
                            <span className="text-gray-600 leading-relaxed">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {contextualHelp.tips?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900">Tips:</h3>
                      <ul className="space-y-2">
                        {contextualHelp.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span className="text-gray-600 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Document Requirements Section */}
                  {contextualHelp.title === "Required Documentation" && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h3 className="font-medium text-gray-900">Accepted Formats:</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-teal-500" />
                          PDF documents
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-teal-500" />
                          Word documents (.doc, .docx)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-teal-500" />
                          Images (.jpg, .png)
                        </li>
                        <li className="flex items-center gap-2 text-red-600">
                          <XCircle size={16} />
                          Maximum file size: 10MB
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Transaction Summary */}
                  {formData.hasTransactions === 'yes' && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h3 className="font-medium text-gray-900">Transaction Summary:</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Total Amount Paid:</span>
                          <span className="font-medium">
                            ${formatNumber(
                              (parseFloat(formData.firstTransaction.amountPaid.replace(/,/g, '')) +
                              parseFloat(formData.additionalTransactions.amountPaid.replace(/,/g, '') || '0')).toString()
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Total Amount Received:</span>
                          <span className="font-medium">
                            ${formatNumber(
                              (parseFloat(formData.firstTransaction.amountReceived.replace(/,/g, '')) +
                              parseFloat(formData.additionalTransactions.amountReceived.replace(/,/g, '') || '0')).toString()
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200">
                          <span>Net Transfer:</span>
                          <span className={`font-medium ${
                            parseFloat(formData.firstTransaction.amountReceived.replace(/,/g, '')) +
                            parseFloat(formData.additionalTransactions.amountReceived.replace(/,/g, '') || '0') >
                            parseFloat(formData.firstTransaction.amountPaid.replace(/,/g, '')) +
                            parseFloat(formData.additionalTransactions.amountPaid.replace(/,/g, '') || '0')
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            ${formatNumber(
                              (
                                (parseFloat(formData.firstTransaction.amountReceived.replace(/,/g, '')) +
                                parseFloat(formData.additionalTransactions.amountReceived.replace(/,/g, '') || '0')) -
                                (parseFloat(formData.firstTransaction.amountPaid.replace(/,/g, '')) +
                                parseFloat(formData.additionalTransactions.amountPaid.replace(/,/g, '') || '0'))
                              ).toString()
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' })}
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

export default TransactionsForm;