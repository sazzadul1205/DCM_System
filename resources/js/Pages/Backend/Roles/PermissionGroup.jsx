// Pages/Backend/Roles/PermissionGroup.jsx

// React
import { useState } from 'react';

// Icons
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function PermissionGroup({
  groupName,
  permissions,
  selectedPermissions,
  onPermissionChange,
  icon: Icon
}) {
  // State
  const [isOpen, setIsOpen] = useState(true);

  // Functions
  const groupPermissions = permissions;
  const allSelected = groupPermissions.every(perm => selectedPermissions.includes(perm));

  // Handle Select All
  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all in group
      groupPermissions.forEach(perm => {
        if (selectedPermissions.includes(perm)) {
          onPermissionChange(perm, false);
        }
      });
    } else {
      // Select all in group
      groupPermissions.forEach(perm => {
        if (!selectedPermissions.includes(perm)) {
          onPermissionChange(perm, true);
        }
      });
    }
  };

  // Get Permission Label
  const getPermissionLabel = (permission) => {
    const parts = permission.split('.');
    return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
  };

  // Get Permission Type
  const getPermissionType = (permission) => {
    if (permission.includes('view')) return 'view';
    if (permission.includes('create')) return 'create';
    if (permission.includes('edit')) return 'edit';
    if (permission.includes('delete')) return 'delete';
    return 'other';
  };

  // Get Type Color
  const getTypeColor = (type) => {
    switch (type) {
      case 'view': return 'text-blue-600 dark:text-blue-400';
      case 'create': return 'text-green-600 dark:text-green-400';
      case 'edit': return 'text-yellow-600 dark:text-yellow-400';
      case 'delete': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Render
  if (groupPermissions.length === 0) return null;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Group Header */}
      <div
        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
          <span className="font-semibold text-gray-900 dark:text-white">
            {groupName} Permissions
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({groupPermissions.length})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectAll();
            }}
            className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
          {isOpen ? <FaChevronDown className="h-4 w-4" /> : <FaChevronRight className="h-4 w-4" />}
        </div>
      </div>

      {/* Group Permissions */}
      {isOpen && (
        <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
          {groupPermissions.map((permission) => {
            const type = getPermissionType(permission);
            const typeColor = getTypeColor(type);

            return (
              <label
                key={permission}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission)}
                  onChange={(e) => onPermissionChange(permission, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${typeColor}`}>
                  {getPermissionLabel(permission)}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}