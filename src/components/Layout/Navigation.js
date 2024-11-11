// src/components/Layout/Navigation.js
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Navigation = ({ currentStep, totalSteps, onNext, onPrevious }) => {
  return (
    <div className="mt-auto">
      <div className="flex items-center mb-4">
        <div className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</div>
        <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors
            ${currentStep === 1 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
        >
          <ArrowLeft size={20} />
          Previous
        </button>
        <button 
          onClick={onNext}
          className="px-6 py-2 rounded-lg bg-teal-500 text-white flex items-center gap-2 hover:bg-teal-600 transition-colors"
        >
          Next
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Navigation;