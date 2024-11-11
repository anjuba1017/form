// src/pages/PartnersForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/images/logo.png';

const PartnerModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [partner, setPartner] = useState(initialData || {
    name: '',
    phone: '',
    email: '',
    country: '',
    city: '',
    address: '',
    postalCode: '',
    amountContributed: '0.00',
    amountWithdrawn: '0.00'
  });

  const isEditing = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(partner, isEditing);
    onClose();
  };

  const handleNumberInput = (field, value) => {
    let numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    setPartner(prev => ({
      ...prev,
      [field]: numericValue || '0.00'
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Partner' : 'Add New Partner'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner Name
              </label>
              <input
                type="text"
                value={partner.name || ''}
                onChange={(e) => setPartner(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                required
                placeholder="Enter partner name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={partner.phone || ''}
                onChange={(e) => setPartner(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={partner.email || ''}
              onChange={(e) => setPartner(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={partner.country || ''}
                onChange={(e) => setPartner(prev => ({ ...prev, country: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                required
                placeholder="Enter country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={partner.city || ''}
                onChange={(e) => setPartner(prev => ({ ...prev, city: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                required
                placeholder="Enter city"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={partner.address || ''}
                onChange={(e) => setPartner(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                required
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={partner.postalCode || ''}
                onChange={(e) => setPartner(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                required
                placeholder="Enter postal code"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Contributed During Last Year
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={partner.amountContributed}
                  onChange={(e) => handleNumberInput('amountContributed', e.target.value)}
                  className="w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Withdrawn During Last Year
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  value={partner.amountWithdrawn}
                  onChange={(e) => handleNumberInput('amountWithdrawn', e.target.value)}
                  className="w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              {isEditing ? 'Save Changes' : 'Add Partner'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};




const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, partnerName }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Delete Partner
        </h3>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete partner "{partnerName}"? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Partner
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PartnersForm = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, partner: null });
  const [partners, setPartners] = useState([]);


  // Navigation handlers
  const handlePrevious = () => {
    navigate('/expenses');
  };

  const handleNext = () => {
    navigate('/balance');
  };

  const handleSavePartner = (partnerData, isEditing) => {
    if (isEditing) {
      setPartners(prev => prev.map(p => 
        p.id === partnerData.id ? partnerData : p
      ));
    } else {
      setPartners(prev => [...prev, {
        ...partnerData,
        id: prev.length + 1
      }]);
    }
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleDeletePartner = (partner) => {
    setDeleteModal({ isOpen: true, partner });
  };

  const confirmDelete = () => {
    if (deleteModal.partner) {
      setPartners(prev => prev.filter(p => p.id !== deleteModal.partner.id));
    }
    setDeleteModal({ isOpen: false, partner: null });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex flex-col"
    >
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
        {/* Left Column - Form */}
        <div className="w-2/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Tell us more about your company
          </h1>

          <p className="text-lg text-gray-700 mb-8">
            Please provide information about the company's partners and their contributions.
          </p>

          {/* Partners List */}
          <div className="space-y-6">
            {partners.map((partner, index) => (
              <div key={partner.id} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">Partner {index + 1}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPartner(partner)}
                      className="text-teal-500 hover:text-teal-600 transition-colors"
                      title="Edit partner"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDeletePartner(partner)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      title="Delete partner"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{partner.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{partner.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{partner.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium">{partner.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{partner.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{partner.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Postal Code</p>
                    <p className="font-medium">{partner.postalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Contributed</p>
                    <p className="font-medium">${partner.amountContributed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Withdrawn</p>
                    <p className="font-medium">${partner.amountWithdrawn}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Partner Button */}
          <button
            onClick={() => {
              setEditingPartner(null);
              setIsModalOpen(true);
            }}
            className="mt-6 flex items-center gap-2 text-teal-500 hover:text-teal-600 transition-colors"
          >
            <Plus size={20} />
            Add a new partner
          </button>

          {/* Progress and Navigation */}
          <div className="mt-12">
            <div className="flex items-center mb-4">
              <div className="text-sm text-gray-500">Step 5 of 5</div>
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
                Next
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
              In order to complete your financial report, it is necessary to know the financial movements made by the owner or partners of the company.
            </blockquote>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PartnersForm;