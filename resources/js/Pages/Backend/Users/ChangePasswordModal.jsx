// Pages/Profile/ChangePasswordModal.jsx

import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { FaLock, FaExclamationTriangle } from 'react-icons/fa';
import Swal from 'sweetalert2';

import Modal from '@/Components/Modal';
import FormField from '@/Components/FormField';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      clearErrors();
    }
  }, [isOpen, reset, clearErrors]);

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => {
        showSuccessAlert('Password changed successfully!');
        reset();
        onClose();
      },
      onError: () => {
        setData('current_password', '');
        setData('password', '');
        setData('password_confirmation', '');
      },
    });
  };

  const firstError = errors.current_password || errors.password || errors.password_confirmation;

  const passwordModalFooter = (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="change-password-form"
        disabled={processing}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing ? 'Updating...' : 'Update Password'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      size="md"
      footer={passwordModalFooter}
    >
      <form id="change-password-form" onSubmit={handleSubmit} className="space-y-5">
        {firstError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-800 dark:text-red-300">{firstError}</p>
            </div>
          </div>
        )}

        <FormField
          id="current_password"
          name="current_password"
          type="password"
          label="Current Password"
          value={data.current_password}
          onChange={(e) => setData('current_password', e.target.value)}
          error={errors.current_password}
          icon={FaLock}
          placeholder="Enter current password"
          autoComplete="current-password"
          required
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label="New Password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          error={errors.password}
          icon={FaLock}
          placeholder="Enter new password"
          autoComplete="new-password"
          required
        />

        <FormField
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          label="Confirm New Password"
          value={data.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          error={errors.password_confirmation}
          icon={FaLock}
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
        />

        <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">
            <strong>Password Requirements:</strong>
            <br />• Minimum 8 characters
            <br />• At least one uppercase letter
            <br />• At least one number
            <br />• At least one special character
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
