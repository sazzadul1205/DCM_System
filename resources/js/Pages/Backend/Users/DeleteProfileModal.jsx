import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { FaExclamationTriangle, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';

import Modal from '@/Components/Modal';
import FormField from '@/Components/FormField';

const DeleteProfileModal = ({ isOpen, onClose }) => {
  const { data, setData, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    password: '',
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      clearErrors();
    }
  }, [isOpen, reset, clearErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();

    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onError: () => {
        setData('password', '');
      },
      onSuccess: () => {
        Swal.fire({
          title: 'Account Deleted',
          text: 'Your profile has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      },
    });
  };

  const modalFooter = (
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
        form="delete-profile-form"
        disabled={processing}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing ? 'Deleting...' : 'Delete Profile'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Profile"
      size="md"
      footer={modalFooter}
    >
      <form id="delete-profile-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
            <div className="text-sm text-red-800 dark:text-red-300">
              <p className="font-semibold">This action cannot be undone.</p>
              <p className="mt-1">
                Please enter your current password to confirm permanent deletion of your account.
              </p>
            </div>
          </div>
        </div>

        {errors.password && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {errors.password}
          </div>
        )}

        {errors.general && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {errors.general}
          </div>
        )}

        <FormField
          id="delete_password"
          name="password"
          type="password"
          label="Current Password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          error={errors.password}
          icon={FaLock}
          placeholder="Enter current password"
          autoComplete="current-password"
          required
        />
      </form>
    </Modal>
  );
};

export default DeleteProfileModal;
