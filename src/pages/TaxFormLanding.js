// src/pages/TaxFormLanding.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { initializeSession, loadFormProgress } from '../utils/session';
import logo from '../assets/images/logo.png';
import illustration from '../assets/images/illustration.png';
import warning from '../assets/images/warning.png';

// Floating animation component
const FloatingDot = ({ delay, duration, size, color, top, left }) => (
  <motion.div
    className={`absolute rounded-full ${size} ${color} hidden md:block`}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      y: [-20, 0, 20] 
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatType: "reverse"
    }}
    style={{ top, left }}
  />
);

// Saving indicator component
const SavingIndicator = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 z-50"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Save className="w-5 h-5 text-teal-600" />
        </motion.div>
        <span className="text-gray-700">Saving your progress...</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// Resume modal component
const ResumeModal = ({ onResume, onStartNew }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
      className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
    >
      <div className="text-center mb-6">
        <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Resume Previous Session?</h2>
        <p className="text-gray-600">
          We found a saved session from your previous visit. Would you like to continue where you left off?
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onResume}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Resume Previous Session
        </button>
        <button
          onClick={onStartNew}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Start New Session
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// Welcome modal component
const WelcomeModal = ({ show, onStart }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
        >
          <div className="flex flex-col items-center">
            <motion.img
              src={warning}
              alt=""
              className="w-16 h-16 mb-6"
              initial={{ rotate: -20 }}
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            <h2 className="text-2xl font-bold mb-4 text-center">
              Welcome to Your Tax Form
            </h2>

            <div className="space-y-4 text-gray-600 w-full mb-6">
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-2">
                  <Info size={18} />
                  Autosave Feature
                </h3>
                <p className="text-teal-700 text-sm">
                  Your progress is automatically saved when:
                </p>
                <ul className="text-sm text-teal-700 list-disc list-outside pl-5 mt-2">
                  <li>You modify any field</li>
                  <li>You navigate between pages</li>
                  <li>You close your browser</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                <CheckCircle size={16} className="text-green-500" />
                <span>You can resume your progress at any time</span>
              </div>
            </div>

            <button
              onClick={onStart}
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Let's Begin
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Error message component
const ErrorMessage = ({ message }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <div className="text-red-500 mb-4">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Error</h2>
        <p className="text-gray-600">{message}</p>
      </div>
      <a
        href="mailto:support@example.com"
        className="text-teal-600 hover:text-teal-700 text-sm"
      >
        Contact Support
      </a>
    </div>
  </div>
);

// Main component
const TaxFormLanding = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showSaving, setShowSaving] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const userParam = params.get('user');
        
        if (!userParam) {
          setError('Invalid access link. Please use the link provided in your email.');
          setIsLoading(false);
          return;
        }

        const email = atob(userParam); // Decode base64 email
        await initializeSession(email);
        
        // Load any saved progress
        const progress = await loadFormProgress();
        if (progress) {
          setSavedProgress(progress);
          setShowResume(true);
          setShowContent(false);
        } else {
          setShowModal(true);
          setShowContent(true);
        }
      } catch (error) {
        setError('Error initializing session. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const handleStart = () => {
    setShowModal(false);
    setShowContent(true);
  };

  const handleResume = () => {
    setShowResume(false);
    setShowContent(true);
    // Navigate to the last active page from saved progress
    if (savedProgress?.lastPage) {
      navigate(savedProgress.lastPage);
    } else {
      navigate('/income');
    }
  };

  const handleStartNew = () => {
    setShowResume(false);
    setShowModal(true);
  };

  const handleNext = () => {
    setShowSaving(true);
    setTimeout(() => {
      setShowSaving(false);
      navigate('/income');
    }, 1500);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <Helmet>
        <title>Tax Form - Welcome</title>
        <meta name="description" content="Complete your tax information form with our step-by-step guide" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden">
        <WelcomeModal show={showModal} onStart={handleStart} />
        <ResumeModal 
          show={showResume} 
          onResume={handleResume} 
          onStartNew={handleStartNew} 
        />
        <SavingIndicator show={showSaving} />

        {showContent && (
          <>
            <header className="bg-white border-b border-gray-200 py-4 px-4">
              <div className="max-w-7xl mx-auto">
                <img src={logo} alt="Company Logo" className="h-8 w-auto" />
              </div>
            </header>

            <main className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content Section */}
                  <motion.section
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col justify-between order-2 lg:order-1"
                  >
                    <div className="space-y-6">
                      <h1 className="text-4xl font-bold text-gray-900">
                        Income, Expense and Cost Information Report
                      </h1>
                      
                      <p className="text-xl text-gray-600 leading-relaxed">
                        To complete your tax forms, we need to gather accurate information about your company's financial transactions from the previous fiscal year.
                      </p>
                      
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                          What you'll need:
                        </h2>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="text-teal-500 flex-shrink-0 w-5 h-5" />
                            <span>Previous year's financial records</span>
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="text-teal-500 flex-shrink-0 w-5 h-5" />
                            <span>Bank statements and transaction history</span>
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="text-teal-500 flex-shrink-0 w-5 h-5" />
                            <span>Expense receipts and invoices</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-sm text-gray-600">Step 1 of 9</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <motion.div
                            className="h-full bg-teal-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "11.11%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleNext}
                        className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-600 text-white flex items-center justify-center gap-3 hover:bg-teal-700 transition-colors"
                      >
                        Begin Form
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </motion.section>
                  
                  {/* Illustration Section */}
                  <motion.section
                    className="relative flex items-center justify-center order-1 lg:order-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="w-full max-w-lg aspect-square relative">
                      <img 
                        src={illustration} 
                        alt=""
                        className="w-full h-full object-contain rounded-3xl bg-gradient-to-br from-teal-50 to-purple-50"
                      />
                      
                      <FloatingDot delay={0} duration={3} size="w-8 h-8" color="bg-teal-100" top="10%" left="10%" />
                      <FloatingDot delay={1} duration={4} size="w-6 h-6" color="bg-purple-100" top="20%" left="80%" />
                      <FloatingDot delay={2} duration={3.5} size="w-10 h-10" color="bg-blue-100" top="70%" left="20%" />
                      
                      {/* Decorative elements */}
                      <motion.div
                        className="absolute -top-8 -right-8 w-32 h-32 bg-teal-50 rounded-full -z-10 hidden sm:block"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, 0]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                      
                      <motion.div
                        className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-50 rounded-full -z-10 hidden sm:block"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, -10, 0]
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    </div>
                  </motion.section>
                </div>
              </div>
            </main>

            {/* Footer with autosave info */}
            <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Save size={16} className="text-teal-500" />
                    <span>Your progress is automatically saved</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default TaxFormLanding;