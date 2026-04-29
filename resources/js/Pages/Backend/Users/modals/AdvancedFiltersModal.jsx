// Pages/Backend/Users/modals/AdvancedFiltersModal.jsx

import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function AdvancedFiltersModal({ isOpen, onClose, filters, roles, onApply }) {
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || '',
    role_id: filters.role_id || '',
    blood_group: filters.blood_group || '',
    gender: filters.gender || '',
    date_from: filters.date_from || '',
    date_to: filters.date_to || '',
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['male', 'female', 'other'];

  const handleReset = () => {
    setLocalFilters({
      status: '',
      role_id: '',
      blood_group: '',
      gender: '',
      date_from: '',
      date_to: '',
    });
    onApply({});
    onClose();
  };

  const handleApply = () => {
    const appliedFilters = {};
    if (localFilters.status) appliedFilters.status = localFilters.status;
    if (localFilters.role_id) appliedFilters.role_id = localFilters.role_id;
    if (localFilters.blood_group) appliedFilters.blood_group = localFilters.blood_group;
    if (localFilters.gender) appliedFilters.gender = localFilters.gender;
    if (localFilters.date_from) appliedFilters.date_from = localFilters.date_from;
    if (localFilters.date_to) appliedFilters.date_to = localFilters.date_to;
    onApply(appliedFilters);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Advanced Filters"
      size="md"
      footer={
        <div className="flex justify-between w-full">
          <button
            onClick={handleReset}
            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
          >
            Reset All
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white hover:shadow-lg transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <select
            value={localFilters.role_id}
            onChange={(e) => setLocalFilters({ ...localFilters, role_id: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Roles</option>
            {roles?.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>

        {/* Blood Group Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Blood Group
          </label>
          <select
            value={localFilters.blood_group}
            onChange={(e) => setLocalFilters({ ...localFilters, blood_group: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gender
          </label>
          <select
            value={localFilters.gender}
            onChange={(e) => setLocalFilters({ ...localFilters, gender: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All</option>
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={localFilters.date_from}
              onChange={(e) => setLocalFilters({ ...localFilters, date_from: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={localFilters.date_to}
              onChange={(e) => setLocalFilters({ ...localFilters, date_to: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}