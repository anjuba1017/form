// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<TaxFormLanding />} />
          <Route path="/income" element={<IncomeForm />} />
          <Route path="/costs" element={<CostsForm />} />
          <Route path="/expenses" element={<ExpensesForm />} />
          <Route path="/TaxQuestions" element={<TaxQuestionsForm />} />
          <Route path="/partners" element={<PartnersForm />} />
          <Route path="/balance" element={<BalanceForm />} />
          <Route path="/company-details" element={<CompanyDetailsForm />} />
          <Route path="/transactions" element={<TransactionsForm />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;