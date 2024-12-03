// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import TaxFormLanding from './pages/TaxFormLanding';
import IncomeForm from './pages/IncomeForm';
import CostsForm from './pages/CostsForm';
import ExpensesForm from './pages/ExpensesForm';
import PartnersForm from './pages/PartnersForm';
import BalanceForm from './pages/BalanceForm';
import CompanyDetailsForm from './pages/CompanyDetailsForm';
import TransactionsForm from './pages/TransactionsForm';
import TaxQuestionsForm from './pages/TaxQuestionsForm';

function App() {
  // Get user parameter from URL
  const params = new URLSearchParams(window.location.search);
  const userParam = params.get('user');

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Landing page that checks authorization */}
          <Route 
            path="/" 
            element={
              userParam ? <TaxFormLanding /> : (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                  <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="text-red-500 text-center mb-4">
                      <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h2 className="text-xl font-bold mb-2">Invalid Access</h2>
                      <p className="text-gray-600">Please use the link provided in your email to access the form.</p>
                    </div>
                  </div>
                </div>
              )
            } 
          />

          {/* Protected routes */}
          <Route 
            path="/income" 
            element={userParam ? <IncomeForm /> : <Navigate to={`/?user=${userParam}`} />} 
          />
          <Route 
            path="/costs" 
            element={userParam ? <CostsForm /> : <Navigate to={`/?user=${userParam}`} />} 
          />
          <Route 
            path="/expenses" 
            element={userParam ? <ExpensesForm /> : <Navigate to={`/?user=${userParam}`} />} 
          />
          <Route 
            path="/TaxQuestions" 
            element={userParam ? <TaxQuestionsForm /> : <Navigate to={`/?user=${userParam}`} />} 
          />
          <Route 
            path="/partners" 
            element={userParam ? <PartnersForm /> : <Navigate to={`/?user=${userParam}`} />} 
          />
          <Route 
            path="/balance" 
            element={userParam ? <BalanceForm /> : <Navigate to={`/?user=${userParam}`} />} 
          />
          <Route 
            path="/company-details" 
            element={userParam ? <CompanyDetailsForm /> : <Navigate to={`/?user=${userParam}`} />} 
          />
          <Route 
            path="/transactions" 
            element={userParam ? <TransactionsForm /> : <Navigate to={`/?user=${userParam}`} />} 
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;