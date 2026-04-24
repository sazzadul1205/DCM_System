// Pages/Backend/Roles/Index.jsx

// React
import { useState } from 'react';

// Inertia
import { Head, useForm, router, usePage } from '@inertiajs/react';

// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// SweetAlert
import Swal from 'sweetalert2';

// Helpers
import RoleFormModal from './RoleFormModal';

// Icons
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheck,
  FaBan,
} from 'react-icons/fa';

export default function RolesIndex({ roles, filters, availablePermissions }) {
  // Page Props
  const { auth } = usePage().props;
  const permission = auth?.user?.role?.permissions;

  // State
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);

  // Form State
  const { data, setData, reset, processing, errors, post, put } = useForm({
    name: '',
    slug: '',
    permissions: [],
    description: '',
    status: 'active',
  });

  // Success Toast Notification
  const showSuccessToast = (message) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#10b981',
      color: '#fff',
    });
  };

  // Error Toast Notification
  const showErrorToast = (message) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#ef4444',
      color: '#fff',
    });
  };

  // Handle Create Role
  const handleCreate = (e) => {
    e.preventDefault();

    post(route('roles.store'), {
      onSuccess: () => {
        showSuccessToast('Role created successfully!');
        setShowCreateModal(false);
        reset();
      },
      onError: (errors) => {
        showErrorToast(Object.values(errors).flat()[0] || 'Failed to create role');
      }
    });
  };

  // Handle Edit Role
  const handleEdit = (role) => {
    setSelectedRole(role);
    setData({
      name: role.name,
      slug: role.slug,
      permissions: role.permissions || [],
      description: role.description || '',
      status: role.status,
    });
    setShowEditModal(true);
  };

  // Handle Update Role
  const handleUpdate = (e) => {
    e.preventDefault();

    put(route('roles.update', selectedRole.id), {
      onSuccess: () => {
        showSuccessToast('Role updated successfully!');
        setShowEditModal(false);
        reset();
        setSelectedRole(null);
      },
      onError: (errors) => {
        showErrorToast(Object.values(errors).flat()[0] || 'Failed to update role');
      }
    });
  };

  // Handle Single Status Update
  const handleStatusUpdate = async (role, newStatus) => {
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Role`,
      text: `Are you sure you want to ${action} "${role.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'active' ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.patch(route('roles.update-status', role.id), { status: newStatus }, {
        onSuccess: () => {
          showSuccessToast(`Role ${action}d successfully!`);
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || `Failed to ${action} role`);
        }
      });
    }
  };

  // Handle Delete Role
  const handleDeleteClick = (role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      router.delete(route('roles.destroy', selectedRole.id), {
        onSuccess: () => {
          setSelectedRole(null);
          setSelectedRoles([]);
          setShowDeleteModal(false);
          showSuccessToast('Role deleted successfully!');
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || 'Failed to delete role');
        }
      });
    }
  };

  // Handle Bulk Operations
  const handleSelectRole = (roleId) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  // Handle Select All
  const handleSelectAll = () => {
    if (selectedRoles.length === roles.data.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roles.data.map(role => role.id));
    }
  };

  // Handle Bulk Delete
  const handleBulkDelete = async () => {
    const count = selectedRoles.length;

    const result = await Swal.fire({
      title: 'Bulk Delete',
      text: `Are you sure you want to delete ${count} role(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setShowBulkDeleteModal(false);

    router.delete(route('roles.bulk.delete'), {
      data: { ids: selectedRoles },
      preserveScroll: true,
      onSuccess: () => {
        setSelectedRoles([]);
        showSuccessToast(`${count} role(s) deleted successfully!`);
      },
      onError: (errors) => {
        showErrorToast(
          Object.values(errors).flat()[0] || 'Failed to delete roles'
        );
      },
    });
  };

  // Handle Bulk Status Update
  const handleBulkStatusUpdate = async (status) => {
    const action = status === 'active' ? 'activate' : 'deactivate';
    const result = await Swal.fire({
      title: `Bulk ${action}`,
      text: `Are you sure you want to ${action} ${selectedRoles.length} role(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'active' ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.put(route('roles.bulk.status'), { ids: selectedRoles, status }, {
        onSuccess: () => {
          showSuccessToast(`${selectedRoles.length} role(s) ${action}d successfully!`);
          setShowBulkStatusModal(false);
          setSelectedRoles([]);
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || `Failed to ${action} roles`);
        }
      });
    }
  };

  // Handle Search and Filters
  const handleSearch = (e) => {
    router.get(route('roles.index'), {
      ...filters,
      search: e.target.value,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  // Handle Status Filter
  const handleStatusFilter = (status) => {
    router.get(route('roles.index'), {
      ...filters,
      status: status,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  // Handle Sorting
  const handleSort = (field) => {
    router.get(route('roles.index'), {
      ...filters,
      sort_field: field,
      sort_direction: filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc',
    }, {
      preserveState: true,
      replace: true,
    });
  };

  // Handle Pagination
  const handlePerPageChange = (perPage) => {
    router.get(route('roles.index'), {
      ...filters,
      per_page: perPage,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  // Get Sort Icon
  const getSortIcon = (field) => {
    if (filters.sort_field !== field) return <FaSort className="ml-1 h-4 w-4" />;
    return filters.sort_direction === 'asc'
      ? <FaSortUp className="ml-1 h-4 w-4" />
      : <FaSortDown className="ml-1 h-4 w-4" />;
  };

  // Check if user has permission
  const hasPermission = (perm) => {
    return permission?.includes(perm);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Roles Management" />

      {/* Body */}
      <div className="mx-auto py-6">

        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Role Management
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage roles and their permissions efficiently
            </p>
          </div>

          {hasPermission('roles.create') && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FaPlus className="h-4 w-4" />
                Create New Role
              </button>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedRoles.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 shadow-sm animate-slideDown">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
                {selectedRoles.length}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                role(s) selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hasPermission('roles.edit') && (
                <button
                  onClick={() => setShowBulkStatusModal(true)}
                  className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-3 py-1.5 text-sm font-medium text-white transition-all hover:shadow-md"
                >
                  <FaCheck className="h-3 w-3" />
                  Bulk Status
                </button>
              )}

              {hasPermission('roles.delete') && (
                <button
                  onClick={() => setShowBulkDeleteModal(true)}
                  className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-3 py-1.5 text-sm font-medium text-white transition-all hover:shadow-md"
                >
                  <FaTrash className="h-3 w-3" />
                  Bulk Delete
                </button>
              )}

              {/* Clear */}
              <button
                onClick={() => setSelectedRoles([])}
                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-1.5 text-sm font-medium text-white transition-all hover:shadow-md"
              >
                <FaTimes className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, slug, or description..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filters.per_page}
            onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
            className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white cursor-pointer"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        {/* Roles Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

            {/* Table Header */}
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRoles.length === roles.data.length && roles.data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('slug')}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Slug
                    {getSortIcon('slug')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Permissions
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Description
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {roles.data.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <td className="whitespace-nowrap px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleSelectRole(role.id)}
                      className="rounded border-gray-300 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      disabled={role.slug === 'super-admin' || role.slug === 'admin'}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {role.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <code className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {role.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                          {perm.split('.').pop()}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                          +{role.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                    {role.description?.substring(0, 60)}
                    {role.description?.length > 60 && '...'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${role.status === 'active'
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-300'
                        : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-300'
                        }`}>
                        {role.status === 'active' ? <FaCheck className="h-2.5 w-2.5" /> : <FaBan className="h-2.5 w-2.5" />}
                        {role.status}
                      </span>
                      {role.slug !== 'super-admin' && role.slug !== 'admin' && (
                        <button
                          onClick={() => handleStatusUpdate(role, role.status === 'active' ? 'inactive' : 'active')}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title={`${role.status === 'active' ? 'Deactivate' : 'Activate'} role`}
                        >
                          {role.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex gap-2">
                      {hasPermission('roles.edit') && (
                        <button
                          onClick={() => handleEdit(role)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title="Edit role"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      )}

                      {/* Delete */}
                      {hasPermission('roles.delete') && (
                        <button
                          onClick={() => handleDeleteClick(role)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={role.slug === 'super-admin' || role.slug === 'admin'}
                          title={role.slug === 'super-admin' || role.slug === 'admin' ? 'Cannot delete system role' : 'Delete role'}
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {roles.meta && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold">{roles.meta.from}</span> to{' '}
              <span className="font-semibold">{roles.meta.to}</span> of{' '}
              <span className="font-semibold">{roles.meta.total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.get(roles.links.prev, {}, { preserveState: true })}
                disabled={!roles.links.prev}
                className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft className="h-3 w-3" />
                Previous
              </button>
              <button
                onClick={() => router.get(roles.links.next, {}, { preserveState: true })}
                disabled={!roles.links.next}
                className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <FaChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Role Form Modal (Create/Edit) */}
        <RoleFormModal
          isOpen={showCreateModal || showEditModal}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            reset();
            setSelectedRole(null);
          }}
          title={showCreateModal ? "Create New Role" : `Edit Role: ${selectedRole?.name}`}
          role={selectedRole}
          formData={data}
          setFormData={(field, value) => setData(field, value)}
          availablePermissions={availablePermissions}
          onSubmit={showCreateModal ? handleCreate : handleUpdate}
          processing={processing}
          errors={errors}
        />

        {/* Single Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <FaTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Role
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete {selectedRole?.name}? This action cannot be undone.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Delete Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Modal */}
        {showBulkDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <FaTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Bulk Delete Roles
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete {selectedRoles.length} role(s)? This action cannot be undone.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowBulkDeleteModal(false)}
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Status Modal */}
        {showBulkStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <FaCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Bulk Update Status
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Update status for {selectedRoles.length} role(s)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleBulkStatusUpdate('active')}
                  className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Activate All
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('inactive')}
                  className="flex-1 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Deactivate All
                </button>
              </div>
              <button
                onClick={() => setShowBulkStatusModal(false)}
                className="mt-3 w-full rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideDown {
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
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

    </AuthenticatedLayout>
  );
}