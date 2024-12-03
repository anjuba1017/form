import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, X, Pencil, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { Helmet } from 'react-helmet';
import logo from '../assets/images/logo.png';

// Helper functions
const formatNumber = (value) => {
  const cleanValue = value.replace(/,/g, '');
  if (!cleanValue || isNaN(cleanValue)) return '0.00';
  
  return Number(cleanValue).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const unformatNumber = (value) => {
  return value.replace(/,/g, '');
};

// Format phone number based on country
const formatPhoneNumber = (phoneNumber, countryCode) => {
  try {
    const formatted = new AsYouType(countryCode).input(phoneNumber);
    return formatted;
  } catch (error) {
    return phoneNumber;
  }
};

// Validate phone number based on country
const isValidPhoneNumber = (phoneNumber, countryCode) => {
  try {
    const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, countryCode);
    return phoneNumberObj ? phoneNumberObj.isValid() : false;
  } catch (error) {
    return false;
  }
};

// Custom styles for Select components
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#14B8A6' : '#E5E7EB',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(20, 184, 166, 0.25)' : 'none',
    '&:hover': {
      borderColor: '#14B8A6'
    },
    minHeight: '42px'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#14B8A6' : state.isFocused ? '#E6FFFA' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    '&:active': {
      backgroundColor: '#14B8A6'
    }
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999
  })
};

// Display Components
const PhoneDisplay = ({ phoneNumber, countryCode }) => {
  const formattedPhone = formatPhoneNumber(phoneNumber, countryCode);
  
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-600">
      <svg 
        className="w-3.5 h-3.5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
      {formattedPhone}
    </div>
  );
};

const SavingIndicator = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 max-w-[calc(100%-2rem)] mx-4 z-50"
        role="status"
        aria-live="polite"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Save className="w-5 h-5 text-teal-600" />
        </motion.div>
        <span className="text-gray-700 text-sm sm:text-base">Saving your progress...</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// Partner Modal Component
const PartnerModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [partner, setPartner] = useState(initialData || {
    name: '',
    phone: '',
    email: '',
    countryCode: '',
    country: '',
    state: '',
    city: '',
    address: '',
    postalCode: '',
    amountContributed: '0.00',
    amountWithdrawn: '0.00'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const isEditing = !!initialData;

  useEffect(() => {
    const countries = Country.getAllCountries().map(country => ({
      value: country.isoCode,
      label: country.name,
      ...country
    }));
    setCountryOptions(countries);

    if (initialData?.country) {
      const country = countries.find(c => c.name === initialData.country);
      if (country) {
        setSelectedCountry(country);
        handleCountryChange(country, true);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData && selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry.value);
      const stateOptions = states.map(state => ({
        value: state.isoCode,
        label: state.name,
        ...state
      }));
      setStateOptions(stateOptions);

      const initialState = stateOptions.find(s => s.name === initialData.state);
      if (initialState) {
        setSelectedState(initialState);
        
        const cities = City.getCitiesOfState(selectedCountry.value, initialState.value);
        const cityOptions = cities.map(city => ({
          value: city.name,
          label: city.name,
          ...city
        }));
        setCityOptions(cityOptions);

        const initialCity = cityOptions.find(c => c.name === initialData.city);
        if (initialCity) {
          setSelectedCity(initialCity);
        }
      }
    }
  }, [selectedCountry, initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!partner.name.trim()) newErrors.name = 'Name is required';
    if (!partner.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partner.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!partner.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (partner.countryCode && !isValidPhoneNumber(partner.phone, partner.countryCode)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (!partner.countryCode) newErrors.country = 'Country is required';
    if (!partner.state) newErrors.state = 'State/Province is required';
    if (!partner.city) newErrors.city = 'City is required';
    if (!partner.address.trim()) newErrors.address = 'Address is required';
    if (!partner.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    
    const contributedAmount = parseFloat(unformatNumber(partner.amountContributed));
    const withdrawnAmount = parseFloat(unformatNumber(partner.amountWithdrawn));
    
    if (isNaN(contributedAmount) || contributedAmount < 0) {
      newErrors.amountContributed = 'Please enter a valid amount';
    }
    if (isNaN(withdrawnAmount) || withdrawnAmount < 0) {
      newErrors.amountWithdrawn = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formattedPartner = {
        ...partner,
        amountContributed: formatNumber(partner.amountContributed),
        amountWithdrawn: formatNumber(partner.amountWithdrawn)
      };
      await onSave(formattedPartner, isEditing);
      onClose();
    } catch (error) {
      console.error('Error saving partner:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Error saving partner. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (value) => {
    if (partner.countryCode) {
      const formatted = new AsYouType(partner.countryCode).input(value);
      setPartner(prev => ({ ...prev, phone: formatted }));
    } else {
      setPartner(prev => ({ ...prev, phone: value }));
    }
  };

  const handleCountryChange = (option, isInitialLoad = false) => {
    setSelectedCountry(option);
    if (!isInitialLoad) {
      setSelectedState(null);
      setSelectedCity(null);
    }
    
    if (option) {
      const states = State.getStatesOfCountry(option.value).map(state => ({
        value: state.isoCode,
        label: state.name,
        ...state
      }));
      setStateOptions(states);
    } else {
      setStateOptions([]);
    }

    setPartner(prev => ({
      ...prev,
      countryCode: option?.value || '',
      country: option?.label || '',
      state: isInitialLoad ? prev.state : '',
      city: isInitialLoad ? prev.city : '',
      phone: isInitialLoad ? prev.phone : '',
    }));
  };

  const handleStateChange = (option) => {
    setSelectedState(option);
    setSelectedCity(null);

    if (option && selectedCountry) {
      const cities = City.getCitiesOfState(selectedCountry.value, option.value).map(city => ({
        value: city.name,
        label: city.name,
        ...city
      }));
      setCityOptions(cities);
    } else {
      setCityOptions([]);
    }

    setPartner(prev => ({
      ...prev,
      state: option?.label || '',
      city: ''
    }));
  };

  const handleCityChange = (option) => {
    setSelectedCity(option);
    setPartner(prev => ({
      ...prev,
      city: option?.label || ''
    }));
  };

  const handleNumberInput = (field, value) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }

    setPartner(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleNumberBlur = (field) => {
    setPartner(prev => ({
      ...prev,
      [field]: formatNumber(prev[field])
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            {isEditing ? 'Edit Partner' : 'Add New Partner'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={partner.name}
                onChange={(e) => setPartner(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.name ? 'border-red-500' : ''
                }`}
                required
                placeholder="Enter partner name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={partner.email}
                onChange={(e) => setPartner(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                required
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                options={countryOptions}
                styles={customSelectStyles}
                className="text-sm"
                placeholder="Select country"
                isClearable
                required
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">{errors.country}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={partner.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.phone ? 'border-red-500' : ''
                }`}
                placeholder={selectedCountry ? `Phone number (${selectedCountry.value})` : 'Select country first'}
                disabled={!selectedCountry}
                required
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedState}
                onChange={handleStateChange}
                options={stateOptions}
                styles={customSelectStyles}
                className="text-sm"
                placeholder={selectedCountry ? "Select state" : "Select country first"}
                isClearable
                isDisabled={!selectedCountry}
                required
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedCity}
                onChange={handleCityChange}
                options={cityOptions}
                styles={customSelectStyles}
                className="text-sm"
                placeholder={selectedState ? "Select city" : "Select state first"}
                isClearable
                isDisabled={!selectedState}
                required
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={partner.address}
                onChange={(e) => setPartner(prev => ({ ...prev, address: e.target.value }))}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.address ? 'border-red-500' : ''
                }`}
                required
                placeholder="Enter street address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={partner.postalCode}
                onChange={(e) => setPartner(prev => ({ ...prev, postalCode: e.target.value }))}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.postalCode ? 'border-red-500' : ''
                }`}
                required
                placeholder="Enter postal code"
              />
              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>
              )}
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Contributed During Last Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={partner.amountContributed}
                  onChange={(e) => handleNumberInput('amountContributed', e.target.value)}
                  onBlur={() => handleNumberBlur('amountContributed')}
                  className={`w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    errors.amountContributed ? 'border-red-500' : ''
                  }`}
                  required
                  placeholder="0.00"
                />
                {errors.amountContributed && (
                  <p className="mt-1 text-sm text-red-500">{errors.amountContributed}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Withdrawn During Last Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={partner.amountWithdrawn}
                  onChange={(e) => handleNumberInput('amountWithdrawn', e.target.value)}
                  onBlur={() => handleNumberBlur('amountWithdrawn')}
                  className={`w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    errors.amountWithdrawn ? 'border-red-500' : ''
                  }`}
                  required
                  placeholder="0.00"
                />
                {errors.amountWithdrawn && (
                  <p className="mt-1 text-sm text-red-500">{errors.amountWithdrawn}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isEditing ? 'Saving Changes...' : 'Adding Partner...'}</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Add Partner'}</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, partnerName }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error deleting partner:', error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <svg 
              className="w-6 h-6 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Delete Partner
          </h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the partner <span className="font-semibold text-gray-900">"{partnerName}"</span>?
          </p>
          
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm">
            <div className="flex gap-2">
              <svg 
                className="w-5 h-5 text-yellow-600 mt-0.5" 
                fill="none"
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium mb-1">Important Note:</p>
                <p>This action cannot be undone. All data associated with this partner will be permanently removed from the system.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg 
                  className="animate-spin h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Delete Partner</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main PartnersForm Component
const PartnersForm = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, partner: null });
  const [partners, setPartners] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSaving, setShowSaving] = useState(false);

  // Calculate totals for partners
  const totals = partners.reduce((acc, partner) => ({
    contributions: acc.contributions + parseFloat(unformatNumber(partner.amountContributed)) || 0,
    withdrawals: acc.withdrawals + parseFloat(unformatNumber(partner.amountWithdrawn)) || 0,
    netMovement: acc.netMovement + 
      (parseFloat(unformatNumber(partner.amountContributed)) || 0) - 
      (parseFloat(unformatNumber(partner.amountWithdrawn)) || 0)
  }), { contributions: 0, withdrawals: 0, netMovement: 0 });

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Show success message temporarily
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Navigation handler with saving indicator
  const handleNavigation = (direction) => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        setShowSaving(true);
        setTimeout(() => {
          setShowSaving(false);
          navigate(direction === 'next' ? '/balance' : '/expenses');
        }, 1500);
      }
    } else {
      setShowSaving(true);
      setTimeout(() => {
        setShowSaving(false);
        navigate(direction === 'next' ? '/balance' : '/expenses');
      }, 1500);
    }
  };

  const handleSavePartner = async (partnerData, isEditing) => {
    setShowSaving(true);
    try {
      if (isEditing) {
        setPartners(prev => prev.map(p => 
          p.id === partnerData.id ? {
            ...partnerData,
            amountContributed: formatNumber(partnerData.amountContributed),
            amountWithdrawn: formatNumber(partnerData.amountWithdrawn)
          } : p
        ));
        showSuccessMessage('Partner updated successfully');
      } else {
        setPartners(prev => [...prev, {
          ...partnerData,
          id: Date.now(),
          amountContributed: formatNumber(partnerData.amountContributed),
          amountWithdrawn: formatNumber(partnerData.amountWithdrawn)
        }]);
        showSuccessMessage('Partner added successfully');
      }
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Error saving partner:', error);
      throw error;
    } finally {
      setTimeout(() => setShowSaving(false), 1500);
    }
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleDeletePartner = (partner) => {
    setDeleteModal({ isOpen: true, partner });
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.partner) {
        setPartners(prev => prev.filter(p => p.id !== deleteModal.partner.id));
        showSuccessMessage('Partner deleted successfully');
        setHasUnsavedChanges(true);
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    if (hasUnsavedChanges && editingPartner) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        return;
      }
    }
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  // Render a partner card
  const renderPartnerCard = (partner, index) => (
    <motion.div
      key={partner.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-100 p-4 rounded-lg hover:shadow-md transition-all border border-gray-100"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">Partner {index + 1}</h3>
          {partner.countryCode && (
            <img 
              src={`https://flagcdn.com/w20/${partner.countryCode.toLowerCase()}.png`}
              alt={`${partner.country} flag`}
              className="w-5 h-auto"
            />
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handleEditPartner(partner)}
            className="text-gray-400 hover:text-teal-500 transition-colors p-1.5 rounded-full hover:bg-white"
            title="Edit partner"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDeletePartner(partner)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-white"
            title="Delete partner"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Name</p>
            <p className="text-sm font-medium text-gray-900">{partner.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Contact</p>
            <p className="text-sm text-gray-900">{partner.email}</p>
            <PhoneDisplay phoneNumber={partner.phone} countryCode={partner.countryCode} />
          </div>
        </div>

        <div className="col-span-5">
          <p className="text-sm text-gray-500 mb-0.5">Location</p>
          <div className="text-sm text-gray-900">
            <p className="font-medium">{partner.address}</p>
            <p>{partner.city}, {partner.state}</p>
            <p>{partner.postalCode}</p>
            <p className="text-gray-900">{partner.country}</p>
          </div>
        </div>

        <div className="col-span-3 flex flex-col justify-end">
          <div className="space-y-2 bg-gray-200 p-3 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Contributed</p>
              <p className="text-sm font-medium text-teal-600">${partner.amountContributed}</p>
            </div>
            <div className="border-t pt-2">
              <p className="text-sm text-gray-500">Withdrawn</p>
              <p className="text-sm font-medium text-purple-600">${partner.amountWithdrawn}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex flex-col"
    >
      <Helmet>
        <title>Partners Information - Tax Form</title>
        <meta name="description" content="Enter company partners information" />
      </Helmet>

      {/* Success Message Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7"
              />
            </svg>
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <PartnerModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSavePartner}
            initialData={editingPartner}
          />
        )}
        {deleteModal.isOpen && (
          <DeleteConfirmationModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, partner: null })}
            onConfirm={confirmDelete}
            partnerName={deleteModal.partner?.name}
          />
        )}
      </AnimatePresence>

      {/* Logo Section */}
      <div className="p-8 border-b">
        <div className="w-12 h-12">
          <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-8 py-12 gap-8">
        {/* Left Column */}
        <div className="w-3/4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Company Members Information
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-2">
                Please provide information about the company's members including their contributions for the year.
              </p>
            </div>
            <div className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">
              Total Partners: {partners.length}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Contributions</h3>
              <p className="text-2xl font-bold text-teal-700">
                ${formatNumber(totals.contributions.toString())}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Withdrawals</h3>
              <p className="text-2xl font-bold text-purple-700">
                ${formatNumber(totals.withdrawals.toString())}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${
              totals.netMovement >= 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Net Movement</h3>
              <p className={`text-2xl font-bold ${
                totals.netMovement >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                ${formatNumber(totals.netMovement.toString())}
              </p>
            </div>
          </div>

          {/* Partners List */}
          <div className="space-y-6">
            {partners.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg 
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-500 mb-4">No partners added yet</p>
                <button
                  onClick={() => {
                    setEditingPartner(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  <Plus size={20} />
                  Add your first partner
                </button>
              </div>
            ) : (
              <>
                {partners.map((partner, index) => renderPartnerCard(partner, index))}
                
                {/* Add Partner Button */}
                <button
                  onClick={() => {
                    setEditingPartner(null);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-teal-500 hover:border-teal-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add another partner
                </button>
              </>
            )}
          </div>

          {/* Progress and Navigation */}
          <div className="mt-12">
            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">Step 6 of 9</div>
              <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                  style={{ width: "66.6%" }}
                ></div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => handleNavigation('prev')}
                className="px-6 py-2 rounded-lg bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <ArrowLeft size={20} />
                Previous
              </button>
              <button 
                onClick={() => handleNavigation('next')}
                className="px-6 py-2 rounded-lg bg-teal-500 text-white flex items-center gap-2 hover:bg-teal-600 transition-colors"
              >
                Next
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Info Box */}
        <div className="w-1/4">
          <div className="bg-teal-50 p-8 rounded-lg sticky top-8">
            <img src={logo} alt="Company Logo" className="w-8 h-8 mb-6" />
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Partner Information</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Provide financial movements made by the owners or partners of the company for accurate financial reporting.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Important Notes:</h4>
                  <ul className="list-disc pl-4 space-y-2 text-gray-600">
                    <li>All monetary values should be in USD</li>
                    <li>Include all financial transactions from the last fiscal year</li>
                    <li>Ensure phone numbers include country code</li>
                    <li>All fields marked with * are required</li>
                  </ul>
                </div>

                {partners.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Financial Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Contributions:</span>
                        <span className="font-medium text-teal-700">
                          ${formatNumber(totals.contributions.toString())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Withdrawals:</span>
                        <span className="font-medium text-purple-700">
                          ${formatNumber(totals.withdrawals.toString())}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-gray-600">Net Movement:</span>
                        <span className={`font-medium ${
                          totals.netMovement >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          ${formatNumber(totals.netMovement.toString())}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {hasUnsavedChanges && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex gap-2">
                      <svg 
                        className="w-5 h-5 text-yellow-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <p className="text-sm text-yellow-800">
                        You have unsaved changes. Make sure to save your changes before leaving this page.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SavingIndicator show={showSaving} />
    </motion.div>
  );
};

export default PartnersForm;