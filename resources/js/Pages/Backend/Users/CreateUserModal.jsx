// Pages/Backend/Users/modals/CreateUserModal.jsx

// React
import { useState } from 'react';
import { router } from '@inertiajs/react';

// SweetAlert
import Swal from 'sweetalert2';

// Icons
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaLock, FaUserTag, FaKey } from 'react-icons/fa';

// Components
import Modal from '@/Components/Modal';
import FormField from '@/Components/FormField';

export default function CreateUserModal({ isOpen, onClose, roles, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_primary: '',
    role_id: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate random password
  const generatePassword = () => {
    const length = 12;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    setFormData(prev => ({
      ...prev,
      password: password,
      password_confirmation: password
    }));

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Password generated!',
      showConfirmButton: false,
      timer: 2000,
    });
  };

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

    router.post(route('users.store'), formData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'User created successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#10b981',
          color: '#fff',
        });
        setFormData({
          name: '',
          email: '',
          phone_primary: '',
          role_id: '',
          password: '',
          password_confirmation: '',
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
      title="Add New User"
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
            form="create-user-form"
            disabled={isSubmitting}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white hover:shadow-lg transition-all disabled:opacity-50"
          >
            <FaUserPlus className="inline mr-2 h-4 w-4" />
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      }
    >
      <form id="create-user-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <FormField
          id="name"
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter user's full name"
          required
          error={errors.name}
          icon={FaUser}
          autoFocus
        />

        {/* Email */}
        <FormField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@example.com"
          required
          error={errors.email}
          icon={FaEnvelope}
        />

        {/* Phone Primary */}
        <FormField
          id="phone_primary"
          name="phone_primary"
          label="Phone Number"
          type="tel"
          value={formData.phone_primary}
          onChange={handleChange}
          placeholder="+880 1XXX-XXXXXX"
          required
          error={errors.phone_primary}
          icon={FaPhone}
        />

        {/* Role */}
        <FormField
          id="role_id"
          name="role_id"
          label="User Role"
          type="select"
          value={formData.role_id}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select role' },
            ...(roles?.map(role => ({ value: role.id, label: role.name })) || [])
          ]}
          required
          error={errors.role_id}
          icon={FaUserTag}
        />

        {/* Password with Generator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <button
              type="button"
              onClick={generatePassword}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FaKey className="h-3 w-3" />
              Generate Password
            </button>
          </div>

          <FormField
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            error={errors.password}
            icon={FaLock}
          />
        </div>

        {/* Confirm Password */}
        <FormField
          id="password_confirmation"
          name="password_confirmation"
          label="Confirm Password"
          type="password"
          value={formData.password_confirmation}
          onChange={handleChange}
          placeholder="Confirm password"
          required
          error={errors.password_confirmation}
          icon={FaLock}
        />
      </form>
    </Modal>
  );
}