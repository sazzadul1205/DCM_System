// Pages/Backend/Users/Index.jsx

// React
import { useState, useEffect } from 'react';

// Inertia
import { Head, router } from '@inertiajs/react';

// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// SweetAlert
import Swal from 'sweetalert2';

// Components
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import AdvancedFiltersModal from './modals/AdvancedFiltersModal';
import ColumnVisibilityModal from './modals/ColumnVisibilityModal';

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
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaArchive,
  FaUserShield,
  FaEye,
  FaFilter,
  FaColumns,
  FaDownload,
  FaSync,
  FaIdCard,
  FaVenusMars,
  FaTint,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

export default function UsersIndex({ users, filters, roles }) {
  // State
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showColumnVisibility, setShowColumnVisibility] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('user_table_columns');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
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
      created_by: false,
    };
  });

  // Save column visibility to localStorage
  useEffect(() => {
    localStorage.setItem('user_table_columns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

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

  // Handle Search with Debounce
  const handleSearchInput = (value) => {
    setSearchInput(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      router.get(route('users.index'), {
        ...filters,
        search: value,
        page: 1,
      }, {
        preserveState: true,
        replace: true,
      });
    }, 500);

    setSearchTimeout(timeout);
  };

  // Handle Advanced Filters
  const handleAdvancedFilters = (advancedFilters) => {
    router.get(route('users.index'), {
      ...filters,
      ...advancedFilters,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
    setShowAdvancedFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput('');
    router.get(route('users.index'), {
      per_page: filters.per_page || 15,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  // Handle Export
  const handleExport = async () => {
    const result = await Swal.fire({
      title: 'Export Users',
      text: 'Select export format',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'CSV',
      denyButtonText: 'Excel',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed || result.isDenied) {
      const format = result.isConfirmed ? 'csv' : 'excel';
      const queryParams = new URLSearchParams({
        ...filters,
        format: format,
        export: true,
        selected_ids: selectedUsers.join(',')
      }).toString();

      window.location.href = route('users.export') + '?' + queryParams;

      showSuccessToast(`Exporting users as ${format.toUpperCase()}...`);
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    router.reload({ preserveScroll: true });
    showSuccessToast('Data refreshed!');
  };

  // Handle Single Status Update
  const handleStatusUpdate = async (user, newStatus) => {
    const action = newStatus === 1 ? 'activate' : 'deactivate';
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      text: `Are you sure you want to ${action} "${user.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 1 ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.patch(route('users.update-status', user.id), { status: newStatus }, {
        onSuccess: () => {
          showSuccessToast(`User ${action}d successfully!`);
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || `Failed to ${action} user`);
        }
      });
    }
  };

  // Handle Delete User
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `You are about to archive <strong>${selectedUser?.name}</strong><br>This user can be restored later.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      router.delete(route('users.destroy', selectedUser.id), {
        onSuccess: () => {
          setSelectedUser(null);
          setSelectedUsers([]);
          setShowDeleteModal(false);
          showSuccessToast('User archived successfully!');
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || 'Failed to archive user');
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

  const handleBulkDelete = async () => {
    const count = selectedUsers.length;

    const result = await Swal.fire({
      title: 'Bulk Archive',
      html: `Are you sure you want to archive <strong>${count}</strong> user(s)?<br>They can be restored later.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, archive all!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setShowBulkDeleteModal(false);

    router.delete(route('users.bulk.delete'), {
      data: { ids: selectedUsers },
      preserveScroll: true,
      onSuccess: () => {
        setSelectedUsers([]);
        showSuccessToast(`${count} user(s) archived successfully!`);
      },
      onError: (errors) => {
        showErrorToast(
          Object.values(errors).flat()[0] || 'Failed to archive users'
        );
      },
    });
  };

  const handleBulkStatusUpdate = async (status) => {
    const action = status === 1 ? 'activate' : 'deactivate';
    const result = await Swal.fire({
      title: `Bulk ${action}`,
      text: `Are you sure you want to ${action} ${selectedUsers.length} user(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 1 ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.put(route('users.bulk.status'), { ids: selectedUsers, status }, {
        onSuccess: () => {
          showSuccessToast(`${selectedUsers.length} user(s) ${action}d successfully!`);
          setShowBulkStatusModal(false);
          setSelectedUsers([]);
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || `Failed to ${action} users`);
        }
      });
    }
  };

  // Handle Sorting
  const handleSort = (field) => {
    router.get(route('users.index'), {
      ...filters,
      sort_field: field,
      sort_direction: filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc',
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePerPageChange = (perPage) => {
    router.get(route('users.index'), {
      ...filters,
      per_page: perPage,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const getSortIcon = (field) => {
    if (filters.sort_field !== field) return <FaSort className="ml-1 h-4 w-4 opacity-50" />;
    return filters.sort_direction === 'asc'
      ? <FaSortUp className="ml-1 h-4 w-4 text-blue-500" />
      : <FaSortDown className="ml-1 h-4 w-4 text-blue-500" />;
  };

  // Format helpers
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleName = (roleId) => {
    const role = roles?.find(r => r.id === roleId);
    return role?.name || 'Unknown Role';
  };

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

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== undefined && filters.status !== '') count++;
    if (filters.role_id) count++;
    if (filters.blood_group) count++;
    if (filters.gender) count++;
    if (filters.date_from) count++;
    if (filters.date_to) count++;
    return count;
  };

  return (
    <AuthenticatedLayout>
      <Head title="User Management" />

      <div className="mx-auto py-6">
        {/* Header with Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaUserShield className="text-blue-600" />
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage system users, roles, and permissions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
          

            <button
              onClick={() => router.get(route('users.archived'))}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-gray-700"
              title="View Archived Users"
            >
              <FaArchive className="h-4 w-4" />
              Archived
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
            >
              <FaPlus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 shadow-sm animate-slideDown">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
                {selectedUsers.length}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                user(s) selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowBulkStatusModal(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-3 py-1.5 text-sm font-medium text-white transition-all hover:shadow-md"
              >
                <FaCheck className="h-3 w-3" />
                Bulk Status
              </button>
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-3 py-1.5 text-sm font-medium text-white transition-all hover:shadow-md"
              >
                <FaTrash className="h-3 w-3" />
                Bulk Archive
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

        {/* Filters Bar - Enhanced */}
        <div className="mb-6 space-y-4">
          {/* Main Search Row */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative group">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, UID, or address..."
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>
            </div>

            <select
              value={filters.per_page || 15}
              onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
              className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white cursor-pointer"
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAdvancedFilters(true)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${getActiveFiltersCount() > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                <FaFilter className="h-4 w-4" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-1 rounded-full bg-white text-blue-600 px-2 py-0.5 text-xs font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowColumnVisibility(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <FaColumns className="h-4 w-4" />
                Columns
              </button>

              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-700"
              >
                <FaDownload className="h-4 w-4" />
                Export
              </button>

              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                title="Refresh"
              >
                <FaSync className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {filters.search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Search: {filters.search}
                  <button onClick={() => handleSearchInput('')} className="ml-1 hover:text-blue-600">
                    <FaTimes className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.status !== undefined && filters.status !== '' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Status: {filters.status === '1' ? 'Active' : 'Inactive'}
                  <button onClick={clearFilters} className="ml-1 hover:text-blue-600">
                    <FaTimes className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.role_id && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Role: {getRoleName(parseInt(filters.role_id))}
                  <button onClick={clearFilters} className="ml-1 hover:text-blue-600">
                    <FaTimes className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.blood_group && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Blood: {filters.blood_group}
                  <button onClick={clearFilters} className="ml-1 hover:text-blue-600">
                    <FaTimes className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-800">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 sticky top-0">
              <tr>
                {visibleColumns.select && (
                  <th className="px-4 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.data?.length && users.data?.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                  </th>
                )}

                {visibleColumns.uid && (
                  <th
                    onClick={() => handleSort('uid')}
                    className="cursor-pointer px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaIdCard className="h-3 w-3" />
                      User ID
                      {getSortIcon('uid')}
                    </div>
                  </th>
                )}

                {visibleColumns.name && (
                  <th
                    onClick={() => handleSort('name')}
                    className="cursor-pointer px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaUser className="h-3 w-3" />
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                )}

                {visibleColumns.email && (
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaEnvelope className="h-3 w-3" />
                      Email
                    </div>
                  </th>
                )}

                {visibleColumns.phone && (
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaPhone className="h-3 w-3" />
                      Phone
                    </div>
                  </th>
                )}

                {visibleColumns.role && (
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Role
                  </th>
                )}

                {visibleColumns.blood_group && (
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaTint className="h-3 w-3" />
                      Blood Group
                    </div>
                  </th>
                )}

                {visibleColumns.gender && (
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaVenusMars className="h-3 w-3" />
                      Gender
                    </div>
                  </th>
                )}

                {visibleColumns.location && (
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaMapMarkerAlt className="h-3 w-3" />
                      Location
                    </div>
                  </th>
                )}

                {visibleColumns.status && (
                  <th
                    onClick={() => handleSort('status')}
                    className="cursor-pointer px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaCheckCircle className="h-3 w-3" />
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                )}

                {visibleColumns.created_at && (
                  <th
                    onClick={() => handleSort('created_at')}
                    className="cursor-pointer px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaCalendarAlt className="h-3 w-3" />
                      Created
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                )}

                {visibleColumns.updated_at && (
                  <th
                    onClick={() => handleSort('updated_at')}
                    className="cursor-pointer px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <FaClock className="h-3 w-3" />
                      Updated
                      {getSortIcon('updated_at')}
                    </div>
                  </th>
                )}

                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {users.data?.length === 0 ? (
                <tr>
                  <td colSpan="12" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                        <FaExclamationTriangle className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No users found</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {getActiveFiltersCount() > 0
                          ? 'Try adjusting your filters'
                          : 'Click "Add User" to create your first user'}
                      </p>
                      {getActiveFiltersCount() > 0 && (
                        <button
                          onClick={clearFilters}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          <FaTimes className="h-4 w-4" />
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group">
                    {visibleColumns.select && (
                      <td className="whitespace-nowrap px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                        />
                      </td>
                    )}

                    {visibleColumns.uid && (
                      <td className="whitespace-nowrap px-4 py-4">
                        <code className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 cursor-help" title={user.uid}>
                          {truncateWithTooltip(user.uid, 12)}
                        </code>
                      </td>
                    )}

                    {visibleColumns.name && (
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <FaUser className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            {user.email && visibleColumns.email === false && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {truncateWithTooltip(user.email, 20)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    )}

                    {visibleColumns.email && (
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FaEnvelope className="h-3 w-3 flex-shrink-0" />
                          <span title={user.email} className="cursor-help break-all">
                            {truncateWithTooltip(user.email, 25)}
                          </span>
                        </div>
                      </td>
                    )}

                    {visibleColumns.phone && (
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FaPhone className="h-3 w-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">{user.phone_primary}</span>
                        </div>
                        {user.phone_secondary && (
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Alt: {user.phone_secondary}
                          </div>
                        )}
                      </td>
                    )}

                    {visibleColumns.role && (
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          {getRoleName(user.role_id)}
                        </span>
                      </td>
                    )}

                    {visibleColumns.blood_group && (
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${user.blood_group ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'text-gray-500'
                          }`}>
                          <FaTint className="h-3 w-3" />
                          {user.blood_group || '—'}
                        </span>
                      </td>
                    )}

                    {visibleColumns.gender && (
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-1">
                          <FaVenusMars className="h-3 w-3 text-gray-400" />
                          <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                            {user.gender || '—'}
                          </span>
                        </div>
                      </td>
                    )}

                    {visibleColumns.location && (
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <FaMapMarkerAlt className="h-3 w-3 flex-shrink-0" />
                          <span>
                            {user.address_district || user.address_division
                              ? `${user.address_district || ''}${user.address_district && user.address_division ? ', ' : ''}${user.address_division || ''}`
                              : '—'}
                          </span>
                        </div>
                      </td>
                    )}

                    {visibleColumns.status && (
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${user.status === 1
                              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-300'
                              : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-300'
                            }`}>
                            {user.status === 1 ? <FaCheck className="h-2.5 w-2.5" /> : <FaBan className="h-2.5 w-2.5" />}
                            {user.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={() => handleStatusUpdate(user, user.status === 1 ? 0 : 1)}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            title={`${user.status === 1 ? 'Deactivate' : 'Activate'} user`}
                          >
                            {user.status === 1 ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    )}

                    {visibleColumns.created_at && (
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(user.created_at)}
                          </span>
                        </div>
                      </td>
                    )}

                    {visibleColumns.updated_at && (
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <FaClock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(user.updated_at)}
                          </span>
                        </div>
                      </td>
                    )}

                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.get(route('users.show', user.id))}
                          className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                          title="View details"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title="Edit user"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Archive user"
                        >
                          <FaTrash className="h-4 w-4" />
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
              <span className="font-semibold">{users.meta.total}</span> results
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

        {/* Modals */}
        {/* Single Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <FaTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Archive User</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to archive "{selectedUser?.name}"? This action can be undone later.
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowDeleteModal(false)} className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all">Cancel</button>
                <button onClick={handleDelete} className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-white hover:shadow-lg transition-all">Archive User</button>
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
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Bulk Archive Users</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to archive {selectedUsers.length} user(s)? This action can be undone later.</p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowBulkDeleteModal(false)} className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all">Cancel</button>
                <button onClick={handleBulkDelete} className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-white hover:shadow-lg transition-all">Archive All</button>
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
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Bulk Update Status</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Update status for {selectedUsers.length} user(s)</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleBulkStatusUpdate(1)} className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-white hover:shadow-lg transition-all">Activate All</button>
                <button onClick={() => handleBulkStatusUpdate(0)} className="flex-1 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-2 text-white hover:shadow-lg transition-all">Deactivate All</button>
              </div>
              <button onClick={() => setShowBulkStatusModal(false)} className="mt-3 w-full rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all">Cancel</button>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          roles={roles}
          onSuccess={() => {
            router.reload({ preserveScroll: true });
          }}
        />

        {/* Edit User Modal */}
        <EditUserModal
          key={selectedUser?.id || 'edit-user'}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          roles={roles}
          onSuccess={() => {
            router.reload({ preserveScroll: true });
          }}
        />

        {/* Advanced Filters Modal */}
        <AdvancedFiltersModal
          isOpen={showAdvancedFilters}
          onClose={() => setShowAdvancedFilters(false)}
          filters={filters}
          roles={roles}
          onApply={handleAdvancedFilters}
        />

        {/* Column Visibility Modal */}
        <ColumnVisibilityModal
          isOpen={showColumnVisibility}
          onClose={() => setShowColumnVisibility(false)}
          visibleColumns={visibleColumns}
          onToggle={(column) => {
            setVisibleColumns(prev => ({
              ...prev,
              [column]: !prev[column]
            }));
          }}
        />
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