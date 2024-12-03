import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Globe2, Building2, CreditCard, HelpCircle, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", 
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe"
];

const commonPlatforms = [
  "Amazon", "Shopify", "Stripe", "PayPal", "Square",
  "Etsy", "eBay", "WooCommerce", "BigCommerce", "Other"
];

const tooltipContent = {
  mainActivities: {
    title: "Business Activities",
    description: "Provide a comprehensive description of your company's primary business operations, services, and products.",
    examples: [
      "E-commerce: Online retail store selling organic beauty products",
      "Services: Digital marketing agency specializing in social media management and SEO",
      "Technology: Software development company focusing on mobile applications",
      "Consulting: Business strategy consulting for startups",
      "Manufacturing: Production of sustainable packaging materials"
    ],
    tips: [
      "Be specific about your primary revenue streams",
      "Include any specialized services or products",
      "Mention your target industries or market segments",
      "Describe your business model (B2B, B2C, or both)"
    ]
  },
  countries: {
    title: "Customer Locations",
    description: "Specify all countries where your business currently serves customers or plans to expand in the near future.",
  },
  platforms: {
    title: "Revenue Platforms",
    description: "Select all digital platforms and payment processors your business uses to receive payments and manage sales.",
    examples: [
      "E-commerce platforms: Shopify, Amazon, eBay",
      "Payment processors: Stripe, PayPal, Square",
      "Marketplace platforms: Etsy, Amazon Marketplace",
      "Custom solutions: Your own website with integrated payment gateway"
    ],
  }
};

const CompanyDetailsForm = () => {
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState(null);
  const suggestionRef = useRef(null);
  
  const [formData, setFormData] = useState({
    mainActivities: '',
    countryInput: '',
    selectedCountries: [],
    platforms: []
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [contextualHelp, setContextualHelp] = useState({
    title: 'Company Information',
    description: 'Fill in the details about your business operations and reach.',
    examples: [],
    tips: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'countryInput') {
      const filtered = countries.filter(country => 
        country.toLowerCase().includes(value.toLowerCase()) &&
        !formData.selectedCountries.includes(country)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && value.length > 0);
    }
  };

  const handleCountrySelect = (country) => {
    if (!formData.selectedCountries.includes(country)) {
      setFormData(prev => ({
        ...prev,
        selectedCountries: [...prev.selectedCountries, country],
        countryInput: ''
      }));
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleRemoveCountry = (countryToRemove) => {
    setFormData(prev => ({
      ...prev,
      selectedCountries: prev.selectedCountries.filter(country => country !== countryToRemove)
    }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const updateContextualHelp = (field) => {
    const content = tooltipContent[field] || {
      title: 'Company Information',
      description: 'Fill in the details about your business operations and reach.',
      examples: [],
      tips: []
    };

    setContextualHelp(content);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <div className="text-sm text-gray-600">Step 8 of 9</div>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: "88.8%" }}
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
                Tell us more about your company
              </h1>
              <p className="text-lg text-gray-700">
                Please provide detailed information about your business operations.
              </p>
            </div>

            {/* Main Form Content */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-8">
              {/* Main Activities */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="text-teal-600" size={20} />
                  <label className="block text-sm font-medium text-gray-800">
                    Company's Main Activities
                  </label>
                  <div className="relative group">
                    <HelpCircle
                      size={16}
                      className="text-red-400 cursor-help"
                      onMouseEnter={() => updateContextualHelp('mainActivities')}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      <div className="font-medium mb-1">{tooltipContent.mainActivities.description}</div>
                      <div className="text-gray-300 text-xs">Hover over the help icon for more detailed examples and tips</div>
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
                <textarea
                  value={formData.mainActivities}
                  onChange={(e) => handleInputChange('mainActivities', e.target.value)}
                  onFocus={() => {
                    setFocusedField('mainActivities');
                    updateContextualHelp('mainActivities');
                  }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Describe your company's main business operations and services..."
                  className={`${inputStyles('mainActivities')} min-h-[120px] resize-none`}
                  maxLength={500}
                />
                <div className="text-sm text-gray-500 text-right">
                  {formData.mainActivities.length}/500 characters
                </div>
              </div>

              {/* Customer Locations */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe2 className="text-teal-600" size={20} />
                  <label className="block text-sm font-medium text-gray-800">
                    Customer Locations
                  </label>
                  <div className="relative group">
                    <HelpCircle
                      size={16}
                      className="text-red-400 cursor-help"
                      onMouseEnter={() => updateContextualHelp('countries')}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      <div className="font-medium mb-1">{tooltipContent.countries.description}</div>
                      <div className="text-gray-300 text-xs">Start typing to see available countries</div>
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>

                {/* Selected Countries */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.selectedCountries.map(country => (
                    <div
                      key={country}
                      className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full"
                    >
                      <span className="text-sm font-medium">{country}</span>
                      <button
                        onClick={() => handleRemoveCountry(country)}
                        className="text-teal-600 hover:text-teal-800"
                        aria-label={`Remove ${country}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Country Input with Autocomplete */}
                <div className="relative" ref={suggestionRef}>
                  <input
                    type="text"
                    value={formData.countryInput}
                    onChange={(e) => handleInputChange('countryInput', e.target.value)}
                    placeholder="Start typing a country name..."
                    className={inputStyles('countryInput')}
                    onFocus={() => {
                      setFocusedField('countryInput');
                      updateContextualHelp('countries');
                      if (formData.countryInput) setShowSuggestions(true);
                    }}
                    aria-label="Search for countries"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <ul className="py-1">
                        {suggestions.map((country, index) => (
                          <li
                            key={country}
                            className="px-4 py-2 hover:bg-teal-50 cursor-pointer flex items-center justify-between text-gray-700 hover:text-teal-700"
                            onClick={() => handleCountrySelect(country)}
                          >
                            <span>{country}</span>
                            <Check size={16} className="text-teal-500" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="text-teal-600" size={20} />
                  <label className="block text-sm font-medium text-gray-800">
                    Revenue Platforms
                  </label>
                  <div className="relative group">
                    <HelpCircle
                      size={16}
                      className="text-red-400 cursor-help"
                      onMouseEnter={() => updateContextualHelp('platforms')}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      <div className="font-medium mb-1">{tooltipContent.platforms.description}</div>
                      <div className="text-gray-300 text-xs">Select all platforms that apply to your business</div>
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {commonPlatforms.map(platform => (
                    <button
                      key={platform}
                      onClick={() => handlePlatformToggle(platform)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${formData.platforms.includes(platform)
                          ? 'bg-teal-100 text-teal-800 ring-2 ring-teal-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      aria-pressed={formData.platforms.includes(platform)}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/balance')}
                className="px-6 py-3 rounded-lg bg-purple-600 text-white flex items-center gap-2 hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none"
              >
                <ArrowLeft size={20} />
                Previous
              </button>
              <button 
                onClick={() => navigate('/transactions')}
                className="px-6 py-3 rounded-lg bg-teal-600 text-white flex items-center gap-2 hover:bg-teal-700 transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none"
              >
                Next
                <ArrowRight size={20} />
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

export default CompanyDetailsForm;