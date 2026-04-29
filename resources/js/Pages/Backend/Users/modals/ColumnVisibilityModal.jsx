// Pages/Backend/Users/modals/ColumnVisibilityModal.jsx

import Modal from '@/Components/Modal';
import {  FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ColumnVisibilityModal({ isOpen, onClose, visibleColumns, onToggle }) {
  const columns = [
    { key: 'select', label: 'Select Checkbox' },
    { key: 'uid', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' },
    { key: 'blood_group', label: 'Blood Group' },
    { key: 'gender', label: 'Gender' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created Date' },
    { key: 'updated_at', label: 'Updated Date' },
  ];

  const handleReset = () => {
    const defaultColumns = {
      select: true,
      uid: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      blood_group: false,
      gender: false,
      location: false,
      status: true,
      created_at: true,
      updated_at: false,
    };
    Object.keys(defaultColumns).forEach(key => {
      if (visibleColumns[key] !== defaultColumns[key]) {
        onToggle(key);
      }
    });
  };

  const handleShowAll = () => {
    Object.keys(visibleColumns).forEach(key => {
      if (!visibleColumns[key]) {
        onToggle(key);
      }
    });
  };

  const handleHideAll = () => {
    Object.keys(visibleColumns).forEach(key => {
      if (key !== 'select' && visibleColumns[key]) {
        onToggle(key);
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Column Visibility"
      size="sm"
      footer={
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <button
              onClick={handleShowAll}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 transition-all"
            >
              Show All
            </button>
            <button
              onClick={handleHideAll}
              className="rounded-lg bg-gray-500 px-3 py-1.5 text-sm text-white hover:bg-gray-600 transition-all"
            >
              Hide All
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg bg-gray-500 px-3 py-1.5 text-sm text-white hover:bg-gray-600 transition-all"
            >
              Reset
            </button>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700 transition-all"
          >
            Done
          </button>
        </div>
      }
    >
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {columns.map(column => (
          <button
            key={column.key}
            onClick={() => onToggle(column.key)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">{column.label}</span>
            {visibleColumns[column.key] ? (
              <FaEye className="h-4 w-4 text-green-600" />
            ) : (
              <FaEyeSlash className="h-4 w-4 text-gray-400" />
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}