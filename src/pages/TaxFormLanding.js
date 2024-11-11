// src/pages/TaxFormLanding.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';
import illustration from '../assets/images/illustration.png';

const TaxFormLanding = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/income');
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
          <img 
            src={logo} 
            alt="Company Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-8 py-12">
        {/* Left Content */}
        <div className="w-1/2 pr-12 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Income, expense and cost information form
            </h1>
            
            <p className="text-lg text-gray-700 mb-6">
              In order to calculate your taxes correctly, {' '}
              <span className="text-green-500 font-medium">
                it is necessary
              </span>{' '}
              to have information related to the financial movements that your company 
              had in the previous fiscal year.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              The following questions will be about your income, expenses and 
              operating costs.
            </p>
            
            <p className="text-lg text-gray-700 mb-12">
              We will work with total values for your convenience.
            </p>
          </div>
          
          {/* Progress and Navigation */}
          <div>
            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">Step 1 of 4</div>
              <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                <div className="w-1/4 h-full bg-teal-500 rounded-full 
                  transition-all duration-300 ease-in-out"
                ></div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                className="px-6 py-2 rounded-lg bg-purple-600 text-white 
                  flex items-center gap-2 hover:bg-purple-700 transition-colors
                  opacity-50 cursor-not-allowed"
                disabled
              >
                <ArrowLeft size={20} />
                Previous
              </button>
              <button 
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-teal-500 text-white 
                  flex items-center gap-2 hover:bg-teal-600 
                  transition-colors active:bg-teal-700"
              >
                Next
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Content - Illustration */}
        <motion.div 
          className="w-1/2 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="w-full max-w-lg">
            <div className="w-full aspect-square relative">
              <img 
                src={illustration} 
                alt="Person working on finances" 
                className="w-full h-full object-contain rounded-full bg-blue-50"
              />
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-50 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-50 rounded-full -z-10"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TaxFormLanding;