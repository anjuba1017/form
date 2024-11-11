// src/context/FormContext.js
import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Landing page data
    companyInfo: {},
    
    // Income page data
    income: {
      services: '0.00',
      products: '0.00',
      interest: '0.00',
      other: '0.00',
      otherDescription: ''
    },
    
    // Summary calculations
    summary: {
      totalRevenue: '0.00',
      totalCosts: '0.00',
      totalExpenses: '0.00',
      netIncome: '0.00'
    }
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};