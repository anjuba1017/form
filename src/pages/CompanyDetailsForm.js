// src/pages/CompanyDetailsForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const CompanyDetailsForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    mainActivities: '',
    customersLocation: '',
    platforms: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add these navigation handlers
  const handlePrevious = () => {
    navigate('/balance');
  };

  const handleNext = () => {
    navigate('/transactions');
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

          <div className="space-y-6">
            {/* Main Activities */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tell us about your company's main activities
              </label>
              <textarea
                value={formData.mainActivities}
                onChange={(e) => handleInputChange('mainActivities', e.target.value)}
                placeholder="Text us here"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 min-h-[100px] resize-none"
              />
            </div>

            {/* Customers Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                What country are your customers located at?
              </label>
              <input
                type="text"
                value={formData.customersLocation}
                onChange={(e) => handleInputChange('customersLocation', e.target.value)}
                placeholder="Text us here"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Platforms */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Do you use any platform to receive income such as Shopify, Amazon, Stripe, etc?
              </label>
              <input
                type="text"
                value={formData.platforms}
                onChange={(e) => handleInputChange('platforms', e.target.value)}
                placeholder="Text us here"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Progress and Navigation */}
          <div className="mt-12">
            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">Step 7 of 7</div>
              <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                <div className="w-full h-full bg-teal-500 rounded-full"></div>
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
                Submit
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

export default CompanyDetailsForm;