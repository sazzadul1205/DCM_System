// Pages/Backend/Users/Archived.jsx

// React
import { useState } from 'react';

// Inertia
import { Head, router } from '@inertiajs/react';

// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// SweetAlert
import Swal from 'sweetalert2';

// Icons
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaArchive,
  FaUndo,
  FaTrashAlt,
  FaUsers,
  FaClock,
  FaUserSlash
} from 'react-icons/fa';

export default function ArchivedIndex({ users, filters, roles }) {
  // State
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showForceDeleteModal, setShowForceDeleteModal] = useState(false);
  const [showBulkRestoreModal, setShowBulkRestoreModal] = useState(false);
  const [showBulkForceDeleteModal, setShowBulkForceDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  // Handle Restore Single User
  const handleRestoreClick = (user) => {
    setSelectedUser(user);
    setShowRestoreModal(true);
  };

  const handleRestore = async () => {
    const result = await Swal.fire({
      title: 'Restore User',
      text: `Are you sure you want to restore "${selectedUser?.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, restore!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.post(route('users.restore', selectedUser.id), {}, {
        onSuccess: () => {
          setSelectedUser(null);
          setSelectedUsers([]);
          setShowRestoreModal(false);
          showSuccessToast('User restored successfully!');
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || 'Failed to restore user');
        }
      });
    }
  };

  // Handle Force Delete Single User
  const handleForceDeleteClick = (user) => {
    setSelectedUser(user);
    setShowForceDeleteModal(true);
  };

  const handleForceDelete = async () => {
    const result = await Swal.fire({
      title: 'Permanently Delete User',
      html: `Are you sure you want to permanently delete <strong>${selectedUser?.name}</strong>?<br><span class="text-red-600">This action CANNOT be undone!</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete permanently!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.delete(route('users.force-delete', selectedUser.id), {
        onSuccess: () => {
          setSelectedUser(null);
          setSelectedUsers([]);
          setShowForceDeleteModal(false);
          showSuccessToast('User permanently deleted!');
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || 'Failed to delete user');
        }
      });
    }
  };

  // Handle Bulk Operations
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.data?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.data?.map(user => user.id) || []);
    }
  };

  const handleBulkRestore = async () => {
    const count = selectedUsers.length;

    const result = await Swal.fire({
      title: 'Bulk Restore',
      text: `Are you sure you want to restore ${count} user(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, restore all!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setShowBulkRestoreModal(false);

    // Make individual restore requests for each user
    let successCount = 0;
    let errorCount = 0;

    for (const userId of selectedUsers) {
      try {
        await new Promise((resolve) => {
          router.post(route('users.restore', userId), {}, {
            onSuccess: () => {
              successCount++;
              resolve();
            },
            onError: () => {
              errorCount++;
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Failed to restore user:', error);
        errorCount++;
      }
    }

    setSelectedUsers([]);

    if (errorCount === 0) {
      showSuccessToast(`${successCount} user(s) restored successfully!`);
    } else {
      showErrorToast(`${successCount} restored, ${errorCount} failed.`);
    }

    router.reload({ preserveScroll: true });
  };

  const handleBulkForceDelete = async () => {
    const count = selectedUsers.length;

    const result = await Swal.fire({
      title: 'Bulk Permanent Delete',
      html: `Are you sure you want to permanently delete <strong>${count}</strong> user(s)?<br><span class="text-red-600">This action CANNOT be undone!</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete all!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setShowBulkForceDeleteModal(false);

    // Make individual force delete requests for each user
    let successCount = 0;
    let errorCount = 0;

    for (const userId of selectedUsers) {
      try {
        await new Promise((resolve) => {
          router.delete(route('users.force-delete', userId), {
            onSuccess: () => {
              successCount++;
              resolve();
            },
            onError: () => {
              errorCount++;
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Failed to force delete user:', error);
        errorCount++;
      }
    }

    setSelectedUsers([]);

    if (errorCount === 0) {
      showSuccessToast(`${successCount} user(s) permanently deleted!`);
    } else {
      showErrorToast(`${successCount} deleted, ${errorCount} failed.`);
    }

    router.reload({ preserveScroll: true });
  };

  // Handle Search and Filters
  const handleSearch = (e) => {
    router.get(route('users.archived'), {
      ...filters,
      search: e.target.value,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleSort = (field) => {
    router.get(route('users.archived'), {
      ...filters,
      sort_field: field,
      sort_direction: filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc',
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePerPageChange = (perPage) => {
    router.get(route('users.archived'), {
      ...filters,
      per_page: perPage,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const getSortIcon = (field) => {
    if (filters.sort_field !== field) return <FaSort className="ml-1 h-4 w-4" />;
    return filters.sort_direction === 'asc'
      ? <FaSortUp className="ml-1 h-4 w-4" />
      : <FaSortDown className="ml-1 h-4 w-4" />;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get role name by ID
  const getRoleName = (roleId) => {
    const role = roles?.find(r => r.id === roleId);
    return role?.name || 'Unknown Role';
  };

  // Truncate string with tooltip
  const truncateWithTooltip = (text, maxLength = 12) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength) + '...';
    return (
      <span title={text} className="cursor-help">
        {truncated}
      </span>
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title="Archived Users" />

      <div className="mx-auto py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaArchive className="text-orange-600" />
              Archived Users
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View and manage soft-deleted users
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.get(route('users.index'))}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700"
              title="Back to Active Users"
            >
              <FaUsers className="h-4 w-4" />
              Active Users
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 p-4 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 shadow-sm animate-slideDown">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white">
                {selectedUsers.length}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                archived user(s) selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowBulkRestoreModal(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-3 py-1.5 text-sm font-medium text-white transition-all hover:shadow-md"
              >
                <FaUndo className="h-3 w-3" />
                Bulk Restore
              </button>
              <button
                onClick={() => setShowBulkForceDeleteModal(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-3 py-1.5 text-sm font-medium text-white transition-all hover:shadow-md"
              >
                <FaTrashAlt className="h-3 w-3" />
                Bulk Permanent Delete
              </button>
              <button
                onClick={() => setSelectedUsers([])}
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
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search archived users by name, email, phone, or UID..."
                value={filters.search || ''}
                onChange={handleSearch}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <select
            value={filters.per_page || 10}
            onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
            className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white cursor-pointer"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        {/* Archived Users Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.data?.length && users.data?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 focus:ring-orange-500 h-4 w-4 cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort('uid')}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    User ID
                    {getSortIcon('uid')}
                  </div>
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
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Role
                </th>
                <th
                  onClick={() => handleSort('deleted_at')}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Archived Date
                    {getSortIcon('deleted_at')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('created_at')}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Created
                    {getSortIcon('created_at')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {users.data?.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                        <FaUserSlash className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No archived users</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">The archive is empty</p>
                      <button
                        onClick={() => router.get(route('users.index'))}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all"
                      >
                        <FaUsers className="h-4 w-4" />
                        Go to Active Users
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 focus:ring-orange-500 h-4 w-4 cursor-pointer"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <code
                        className="text-sm font-mono font-semibold text-orange-600 dark:text-orange-400 cursor-help"
                        title={user.uid}
                      >
                        {truncateWithTooltip(user.uid, 10)}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <FaUser className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FaEnvelope className="h-3 w-3" />
                          <span title={user.email} className="cursor-help">
                            {truncateWithTooltip(user.email, 20)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FaPhone className="h-3 w-3" />
                          {user.phone_primary}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {getRoleName(user.role_id)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaClock className="h-3 w-3 text-orange-400" />
                        <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                          {formatDate(user.deleted_at)}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestoreClick(user)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title="Restore user"
                        >
                          <FaUndo className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleForceDeleteClick(user)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Permanently delete"
                        >
                          <FaTrashAlt className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.meta && users.data?.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold">{users.meta.from}</span> to{' '}
              <span className="font-semibold">{users.meta.to}</span> of{' '}
              <span className="font-semibold">{users.meta.total}</span> archived results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.get(users.links.prev, {}, { preserveState: true })}
                disabled={!users.links.prev}
                className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft className="h-3 w-3" />
                Previous
              </button>
              <button
                onClick={() => router.get(users.links.next, {}, { preserveState: true })}
                disabled={!users.links.next}
                className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <FaChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Restore Single Modal */}
        {showRestoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <FaUndo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Restore User</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to restore "<strong>{selectedUser?.name}</strong>"?
                  The user will become active again.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestore}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Restore User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Force Delete Single Modal */}
        {showForceDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <FaTrashAlt className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Permanently Delete User</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Are you sure you want to permanently delete "<strong>{selectedUser?.name}</strong>"?
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  ⚠️ This action CANNOT be undone! All user data will be permanently removed.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowForceDeleteModal(false)}
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForceDelete}
                  className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Restore Modal */}
        {showBulkRestoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <FaUndo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Bulk Restore Users</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to restore <strong>{selectedUsers.length}</strong> archived user(s)?
                  They will become active again.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowBulkRestoreModal(false)}
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkRestore}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Restore All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Force Delete Modal */}
        {showBulkForceDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <FaTrashAlt className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Bulk Permanent Delete</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Are you sure you want to permanently delete <strong>{selectedUsers.length}</strong> archived user(s)?
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  ⚠️ This action CANNOT be undone! All user data will be permanently removed.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowBulkForceDeleteModal(false)}
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkForceDelete}
                  className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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