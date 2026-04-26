// Components/QuickCreatePatientModal.jsx

// React
import { useState } from 'react';
import { router } from '@inertiajs/react';

// SweetAlert
import Swal from 'sweetalert2';

// Icons
import { FaUserPlus } from 'react-icons/fa';

// Components
import Modal from '@/Components/Modal';
import FormField from '@/Components/FormField';

export default function QuickCreatePatientModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone_primary: '',
    gender: '',
    date_of_birth: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post(route('patients.quick-store'), formData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Patient created successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#10b981',
          color: '#fff',
        });
        setFormData({
          name: '',
          phone_primary: '',
          gender: '',
          date_of_birth: '',
          status: 'active'
        });
        setErrors({});
        onClose();
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        setErrors(error);
        setIsSubmitting(false);
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Register Patient"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="quick-create-form"
            disabled={isSubmitting}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white hover:shadow-lg transition-all disabled:opacity-50"
          >
            <FaUserPlus className="inline mr-2 h-4 w-4" />
            {isSubmitting ? 'Creating...' : 'Create Patient'}
          </button>
        </div>
      }
    >
      <form id="quick-create-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="name"
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter patient's full name"
          required
          error={errors.name}
          autoFocus
        />

        <FormField
          id="phone_primary"
          name="phone_primary"
          label="Primary Phone"
          type="tel"
          value={formData.phone_primary}
          onChange={handleChange}
          placeholder="Enter phone number"
          required
          error={errors.phone_primary}
        />

        <FormField
          id="gender"
          name="gender"
          label="Gender"
          type="select"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select gender' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ]}
          required
          error={errors.gender}
        />

        <FormField
          id="date_of_birth"
          name="date_of_birth"
          label="Date of Birth"
          type="date"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
          error={errors.date_of_birth}
        />
      </form>
    </Modal>
  );
}