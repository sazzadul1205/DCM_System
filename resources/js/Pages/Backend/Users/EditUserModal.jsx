// Pages/Backend/Users/modals/EditUserModal.jsx

// React
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

// SweetAlert
import Swal from 'sweetalert2';

// Icons
import { FaSave, FaUser, FaEnvelope, FaPhone, FaUserTag, FaLock, FaKey, FaIdCard, FaSyncAlt } from 'react-icons/fa';

// Components
import Modal from '@/Components/Modal';
import FormField from '@/Components/FormField';

export default function EditUserModal({ isOpen, onClose, user, roles, onSuccess }) {

  // State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_primary: '',
    role_id: '',
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    password_confirmation: '',
  });
  const [changePassword, setChangePassword] = useState(false);

  // Update form data when user prop changes (when modal opens with a new user)
  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone_primary: user.phone_primary || '',
        role_id: user.role_id || '',
      });
    }

    setPasswordData({
      password: '',
      password_confirmation: '',
    });

    setErrors({});
    setChangePassword(false);

  }, [isOpen, user]);

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

    setPasswordData({
      password: password,
      password_confirmation: password
    });

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Password generated!',
      showConfirmButton: false,
      timer: 2000,
      background: '#10b981',
      color: '#fff',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data for submission
    const submitData = { ...formData };

    // Only include password data if change password is enabled
    if (changePassword) {
      if (passwordData.password) {
        submitData.password = passwordData.password;
        submitData.password_confirmation = passwordData.password_confirmation;
      } else {
        setErrors({ password: 'Please generate or enter a password' });
        setIsSubmitting(false);
        return;
      }
    }

    router.put(route('users.update', user?.id), submitData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'User updated successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#10b981',
          color: '#fff',
        });
        setErrors({});
        setChangePassword(false);
        setPasswordData({
          password: '',
          password_confirmation: '',
        });
        onClose();
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        setErrors(error);
        setIsSubmitting(false);
      }
    });
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
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
            form="edit-user-form"
            disabled={isSubmitting}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white hover:shadow-lg transition-all disabled:opacity-50"
          >
            <FaSave className="inline mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      }
    >
      <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-5">
        {/* User ID - Read Only */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm">
            <FaIdCard className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-600 dark:text-gray-400">User ID:</span>
            <code className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
              {user.uid}
            </code>
          </div>
        </div>

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

        {/* Password Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <FaLock className="inline mr-2 h-4 w-4" />
              Password
            </label>
            {!changePassword ? (
              <button
                type="button"
                onClick={() => setChangePassword(true)}
                className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all"
              >
                <FaKey className="h-3.5 w-3.5" />
                Change Password
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setChangePassword(false);
                  setPasswordData({
                    password: '',
                    password_confirmation: '',
                  });
                }}
                className="inline-flex items-center gap-2 text-sm bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-all"
              >
                Cancel
              </button>
            )}
          </div>

          {!changePassword && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <FaLock className="h-3 w-3" />
                Password is not shown for security. Click "Change Password" to set a new one.
              </p>
            </div>
          )}

          {changePassword && (
            <div className="space-y-4 animate-fadeIn">
              {/* Password with Generator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="inline-flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-lg transition-all"
                  >
                    <FaSyncAlt className="h-3 w-3" />
                    Generate Password
                  </button>
                </div>

                <FormField
                  id="password"
                  name="password"
                  type="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 8 characters)"
                  required={changePassword}
                  error={errors.password}
                  icon={FaLock}
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm Password */}
              <FormField
                id="password_confirmation"
                name="password_confirmation"
                label="Confirm Password"
                type="password"
                value={passwordData.password_confirmation}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required={changePassword}
                error={errors.password_confirmation}
                icon={FaLock}
                autoComplete="new-password"
              />

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  ⚠️ Password requirements: Minimum 8 characters, including at least one uppercase letter,
                  one lowercase letter, one number, and one special character.
                </p>
              </div>
            </div>
          )}
        </div>
      </form>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Modal>
  );
}