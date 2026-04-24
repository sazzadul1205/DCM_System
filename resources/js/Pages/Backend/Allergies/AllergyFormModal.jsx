// Pages/Backend/Allergies/AllergyFormModal.jsx

// React
import { useEffect, useRef } from 'react';

// Icons
import {
  FaAllergies,
  FaTags,
  FaExclamationTriangle,
  FaStethoscope,
  FaInfoCircle,
} from 'react-icons/fa';

// Components
import Modal from '@/Components/Modal';
import FormField from '@/Components/FormField';

export default function AllergyFormModal({
  isOpen,
  onClose,
  title,
  allergy,
  formData,
  setFormData,
  onSubmit,
  processing,
  errors = {}
}) {
  const prevIsOpen = useRef(false);

  // Only clear form when modal CLOSES, not when it opens
  useEffect(() => {
    if (prevIsOpen.current && !isOpen) {
      // Modal just closed - reset form
      setFormData('name', '');
      setFormData('type', '');
      setFormData('description', '');
      setFormData('common_symptoms', '');
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  // Allergy type options (lowercase to match database)
  const allergyTypes = [
    { value: '', label: 'Choose Allergy Type' },
    { value: 'food', label: 'Food Allergy' },
    { value: 'medication', label: 'Medication Allergy' },
    { value: 'environmental', label: 'Environmental Allergy' },
    { value: 'seasonal', label: 'Seasonal Allergy' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FaAllergies className="text-blue-600" />
          <span>{title}</span>
        </div>
      }
      size="lg"
      footer={
        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-gray-500">
            Fill in the allergy details
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
              form="allergy-form"
              disabled={processing}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing
                ? (allergy ? 'Updating...' : 'Creating...')
                : (allergy ? 'Update Allergy' : 'Create Allergy')}
            </button>
          </div>
        </div>
      }
    >
      <form id="allergy-form" onSubmit={onSubmit}>
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
                label="Allergy Name"
                value={formData.name}
                onChange={(e) => setFormData('name', e.target.value)}
                placeholder="Enter allergy name (e.g., Peanuts, Penicillin)"
                required
                autoFocus
                icon={FaAllergies}
                error={errors.name}
              />

              {/* TYPE */}
              <FormField
                id="type"
                name="type"
                label="Allergy Type"
                type="select"
                value={formData.type || ''}
                onChange={(e) => setFormData('type', e.target.value)}
                options={allergyTypes}
                required
                icon={FaTags}
                error={errors.type}
              />

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <FormField
                  id="description"
                  name="description"
                  label="Description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData('description', e.target.value)}
                  placeholder="Describe the allergy in detail..."
                  type="textarea"
                  error={errors.description}
                />
              </div>
            </div>
          </div>

          {/* SYMPTOMS CARD */}
          <div className="px-5">
            <div className="flex items-center gap-2 mb-4">
              <FaStethoscope className="text-purple-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Symptoms Information
              </h4>
            </div>

            <div className="space-y-4">
              {/* COMMON SYMPTOMS */}
              <FormField
                id="common_symptoms"
                name="common_symptoms"
                label="Common Symptoms"
                value={formData.common_symptoms || ''}
                onChange={(e) => setFormData('common_symptoms', e.target.value)}
                placeholder="E.g., Hives, Swelling, Difficulty breathing, Itching"
                type="textarea"
                error={errors.common_symptoms}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}