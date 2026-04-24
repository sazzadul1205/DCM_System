// Pages/Backend/MedicalConditions/MedicalConditionFormModal.jsx

// React
import { useEffect } from 'react';

// Icons
import {
  FaNotesMedical,
  FaTags,
  FaExclamationTriangle,
  FaTooth,
  FaHeartbeat,
  FaInfoCircle,
} from 'react-icons/fa';

// Components
import Modal from '@/Components/Modal';
import FormField from '@/Components/FormField';

export default function MedicalConditionFormModal({
  isOpen,
  onClose,
  title,
  condition,
  formData,
  setFormData,
  onSubmit,
  processing,
  errors = {}
}) {

  // Clear form when modal opens/closes
  useEffect(() => {
    if (!isOpen && !condition) {
      // Reset form when modal closes
      setFormData('name', '');
      setFormData('category', '');
      setFormData('description', '');
      setFormData('is_dental', false);
      setFormData('requires_attention', false);
    }
  }, [isOpen]);

  // Category options
  const categoryOptions = [
    { value: '', label: 'Choose Medical Category' },
    { value: 'Cardiovascular', label: 'Cardiovascular' },
    { value: 'Respiratory', label: 'Respiratory' },
    { value: 'Neurological', label: 'Neurological' },
    { value: 'Endocrine', label: 'Endocrine' },
    { value: 'Gastrointestinal', label: 'Gastrointestinal' },
    { value: 'Dental', label: 'Dental' },
    { value: 'Mental Health', label: 'Mental Health' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FaNotesMedical className="text-blue-600" />
          <span>{title}</span>
        </div>
      }
      size="lg"
      footer={
        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-gray-500">
            Fill in the medical condition details
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="condition-form"
              disabled={processing}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing
                ? (condition ? 'Updating...' : 'Creating...')
                : (condition ? 'Update Condition' : 'Create Condition')}
            </button>
          </div>
        </div>
      }
    >
      <form id="condition-form" onSubmit={onSubmit}>
        <div className="space-y-6">

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaExclamationTriangle className="text-red-500" />
                <h4 className="font-semibold text-red-800 dark:text-red-200">
                  Please fix the following errors:
                </h4>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(errors).map(([key, value]) => (
                  <li key={key} className="text-sm text-red-700 dark:text-red-300">
                    {Array.isArray(value) ? value[0] : value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* BASIC INFO CARD */}
          <div className="px-5">
            <div className="flex items-center gap-2 mb-4">
              <FaInfoCircle className="text-blue-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NAME */}
              <FormField
                id="name"
                name="name"
                label="Condition Name"
                value={formData.name}
                onChange={(e) => setFormData('name', e.target.value)}
                placeholder="Enter medical condition name"
                required
                autoFocus
                icon={FaNotesMedical}
                error={errors.name}
              />

              {/* CATEGORY */}
              <FormField
                id="category"
                name="category"
                label="Category"
                type="select"
                value={formData.category}
                onChange={(e) => setFormData('category', e.target.value)}
                options={categoryOptions}
                required
                icon={FaTags}
                error={errors.category}
              />

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <FormField
                  id="description"
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData('description', e.target.value)}
                  placeholder="Describe the medical condition in detail..."
                  type="textarea"
                  error={errors.description}
                />
              </div>
            </div>
          </div>

          {/* ADDITIONAL INFO CARD */}
          <div className="px-5">
            <div className="flex items-center gap-2 mb-4">
              <FaHeartbeat className="text-purple-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Additional Information
              </h4>
            </div>

            <div className="flex justify-between items-center space-y-4">
              {/* DENTAL CHECKBOX */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_dental"
                  checked={formData.is_dental}
                  onChange={(e) => setFormData('is_dental', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="is_dental" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FaTooth className="text-pink-500" />
                  Dental Condition
                </label>
              </div>

              {/* REQUIRES ATTENTION CHECKBOX */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requires_attention"
                  checked={formData.requires_attention}
                  onChange={(e) => setFormData('requires_attention', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                />
                <label htmlFor="requires_attention" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-500" />
                  Requires Special Attention
                </label>
              </div>

            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Marking "Requires Special Attention" will flag this condition for immediate review in patient records.
            </p>
          </div>
        </div>
      </form>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </Modal>
  );
}