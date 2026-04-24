// pages/Backend/Roles/RoleFormModal.jsx

// React
import { useEffect } from 'react';

// Icons
import {
  FaUser,
  FaTachometerAlt,
  FaUserShield,
  FaIdCard,
  FaExclamationTriangle,
  FaAllergies
} from 'react-icons/fa';

// Components
import Modal from '@/Components/Modal';
import FormField from '@/Components/FormField';

// Helpers
import PermissionGroup from './PermissionGroup';

export default function RoleFormModal({
  isOpen,
  onClose,
  title,
  role,
  formData,
  setFormData,
  availablePermissions,
  onSubmit,
  processing,
  errors = {}
}) {

  // Group permissions
  const groupedPermissions = {
    'Dashboard': {
      icon: FaTachometerAlt,
      permissions: availablePermissions.filter(p => p.startsWith('dashboard.'))
    },
    'Profile': {
      icon: FaIdCard,
      permissions: availablePermissions.filter(p => p.startsWith('profile.'))
    },
    'Roles': {
      icon: FaUserShield,
      permissions: availablePermissions.filter(p => p.startsWith('roles.'))
    },
    "Allergies": {
      icon: FaAllergies,
      permissions: availablePermissions.filter(p => p.startsWith('allergies.'))
    },
  };

  // Handle permission toggle
  const handlePermissionToggle = (permission, checked) => {
    if (checked) {
      setFormData('permissions', [...formData.permissions, permission]);
    } else {
      setFormData('permissions', formData.permissions.filter(p => p !== permission));
    }
  };

  // Generate slug from name (only for new roles)
  useEffect(() => {
    if (!role && formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData('slug', slug);
    }
  }, [formData.name, role]);

  // Clear form when modal opens/closes
  useEffect(() => {
    if (!isOpen && !role) {
      // Reset form when modal closes
      setFormData('name', '');
      setFormData('slug', '');
      setFormData('permissions', []);
      setFormData('description', '');
      setFormData('status', 'active');
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FaUserShield className="text-blue-600" />
          <span>{title}</span>
        </div>
      }
      size="xl"
      footer={
        <div className="flex justify-between items-center w-full">
          <span className="text-sm text-gray-500">
            {formData.permissions.length} permissions selected
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
              form="role-form"
              disabled={processing}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing
                ? (role ? 'Updating...' : 'Creating...')
                : (role ? 'Update Role' : 'Create Role')}
            </button>
          </div>
        </div>
      }
    >
      <form id="role-form" onSubmit={onSubmit}>
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
              <FaUser className="text-blue-500" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* NAME */}
              <FormField
                id="name"
                name="name"
                label="Role Name"
                value={formData.name}
                onChange={(e) => setFormData('name', e.target.value)}
                placeholder="Enter role name"
                required
                autoFocus
                icon={FaUser}
                error={errors.name}
              />

              {/* SLUG */}
              <FormField
                id="slug"
                name="slug"
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData('slug', e.target.value)}
                placeholder="Enter role slug (e.g., editor, viewer)"
                required
                autoFocus
                icon={FaUser}
                error={errors.slug}
              />

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <FormField
                  id="description"
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData('description', e.target.value)}
                  placeholder="Optional description..."
                  type="textarea"
                  error={errors.description}
                />
              </div>
            </div>
          </div>

          {/* PERMISSIONS CARD */}
          <div className=" px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaUserShield className="text-purple-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Permissions
                </h4>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData('permissions', [])}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear all
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Assign permissions by category. Click Select All to quickly assign all permissions in a category.
            </p>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(groupedPermissions).map(([groupName, group]) => (
                group.permissions.length > 0 && (
                  <PermissionGroup
                    key={groupName}
                    groupName={groupName}
                    permissions={group.permissions}
                    selectedPermissions={formData.permissions}
                    onPermissionChange={handlePermissionToggle}
                    icon={group.icon}
                  />
                )
              ))}
            </div>
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