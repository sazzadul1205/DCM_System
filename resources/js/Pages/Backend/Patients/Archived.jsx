// Pages/Backend/Patients/Archived.jsx

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
  FaArrowLeft,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaUndo,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaVenusMars,
  FaArchive,
  FaTimes,
  FaExclamationTriangle,
} from 'react-icons/fa';

export default function Archived({ archivedPatients, filters }) {
  // State
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showForceDeleteModal, setShowForceDeleteModal] = useState(false);
  const [showBulkRestoreModal, setShowBulkRestoreModal] = useState(false);
  const [showBulkForceDeleteModal, setShowBulkForceDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  // Handle Restore Single Patient
  const handleRestoreClick = (patient) => {
    setSelectedPatient(patient);
    setShowRestoreModal(true);
  };

  const handleRestore = async () => {
    const result = await Swal.fire({
      title: 'Restore Patient',
      text: `Are you sure you want to restore "${selectedPatient?.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, restore!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.patch(route('patients.restore', selectedPatient.id), {}, {
        onSuccess: () => {
          setSelectedPatient(null);
          setShowRestoreModal(false);
          showSuccessToast('Patient restored successfully!');
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || 'Failed to restore patient');
        }
      });
    }
  };

  // Handle Force Delete Single Patient
  const handleForceDeleteClick = (patient) => {
    setSelectedPatient(patient);
    setShowForceDeleteModal(true);
  };

  const handleForceDelete = async () => {
    const result = await Swal.fire({
      title: 'Permanently Delete Patient',
      text: `Are you absolutely sure you want to permanently delete "${selectedPatient?.name}"? This action CANNOT be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete permanently!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.delete(route('patients.force-delete', selectedPatient.id), {
        onSuccess: () => {
          setSelectedPatient(null);
          setShowForceDeleteModal(false);
          showSuccessToast('Patient permanently deleted!');
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || 'Failed to delete patient');
        }
      });
    }
  };

  // Handle Bulk Operations
  const handleSelectPatient = (patientId) => {
    setSelectedPatients(prev =>
      prev.includes(patientId)
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPatients.length === archivedPatients.data.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(archivedPatients.data.map(patient => patient.id));
    }
  };

  const handleBulkRestore = async () => {
    const count = selectedPatients.length;
    const result = await Swal.fire({
      title: 'Bulk Restore',
      text: `Are you sure you want to restore ${count} patient(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, restore all!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setShowBulkRestoreModal(false);

    router.put(route('patients.bulk.restore'), {
      ids: selectedPatients,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedPatients([]);
        showSuccessToast(`${count} patient(s) restored successfully!`);
      },
      onError: (errors) => {
        showErrorToast(
          Object.values(errors).flat()[0] || 'Failed to restore patients'
        );
      },
    });
  };

  const handleBulkForceDelete = async () => {
    const count = selectedPatients.length;
    const result = await Swal.fire({
      title: 'Bulk Permanent Delete',
      text: `Are you absolutely sure you want to permanently delete ${count} patient(s)? This action CANNOT be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete permanently!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setShowBulkForceDeleteModal(false);

    // Fix: Use post() with _method DELETE or ensure the data format is correct
    router.delete(route('patients.bulk.force-delete'), {
      data: { ids: selectedPatients },
      preserveScroll: true,
      onSuccess: () => {
        setSelectedPatients([]);
        showSuccessToast(`${count} patient(s) permanently deleted!`);
      },
      onError: (errors) => {
        console.error('Bulk force delete error:', errors);
        showErrorToast(
          Object.values(errors).flat()[0] || 'Failed to delete patients'
        );
      },
    });
  };

  // Handle Search and Filters
  const handleSearch = (e) => {
    router.get(route('patients.archived'), {
      ...filters,
      search: e.target.value,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleSort = (field) => {
    router.get(route('patients.archived'), {
      ...filters,
      sort_field: field,
      sort_direction: filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc',
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePerPageChange = (perPage) => {
    router.get(route('patients.archived'), {
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
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Archived Patients" />

      <div className="mx-auto py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.get(route('patients.index'))}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaArchive className="text-gray-600 dark:text-gray-400" />
                  Archived Patients
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Manage and restore archived patient records
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
        </div>

        {/* Bulk Actions Bar */}
        {selectedPatients.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 shadow-sm animate-slideDown">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white">
                {selectedPatients.length}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                patient(s) selected
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
                <FaTrash className="h-3 w-3" />
                Bulk Permanent Delete
              </button>
              <button
                onClick={() => setSelectedPatients([])}
                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-1.5 text-sm font-medium text-white transition-all hover:shadow-md"
              >
                <FaTimes className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative group">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search archived patients by name, UID, or phone..."
              value={filters.search}
              onChange={handleSearch}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Archived Patients Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPatients.length === archivedPatients.data.length && archivedPatients.data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort('patient_uid')}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Patient ID
                    {getSortIcon('patient_uid')}
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
                  Gender
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
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Archived By
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {archivedPatients.data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                        <FaArchive className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No archived patients</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Archived patients will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                archivedPatients.data.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <td className="whitespace-nowrap px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPatients.includes(patient.id)}
                        onChange={() => handleSelectPatient(patient.id)}
                        className="rounded border-gray-300 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <code className="text-sm font-mono font-semibold text-gray-600 dark:text-gray-400">
                        {patient.patient_uid}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <FaUser className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {patient.name}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaPhone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{patient.phone_primary}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaVenusMars className="h-3 w-3 text-purple-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{patient.gender}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="h-3 w-3 text-red-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(patient.deleted_at)}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {patient.deleted_by?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestoreClick(patient)}
                          className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                          title="Restore patient"
                        >
                          <FaUndo className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleForceDeleteClick(patient)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Permanently delete"
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
        {archivedPatients.meta && archivedPatients.data.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold">{archivedPatients.meta.from}</span> to{' '}
              <span className="font-semibold">{archivedPatients.meta.to}</span> of{' '}
              <span className="font-semibold">{archivedPatients.meta.total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.get(archivedPatients.links.prev, {}, { preserveState: true })}
                disabled={!archivedPatients.links.prev}
                className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft className="h-3 w-3" />
                Previous
              </button>
              <button
                onClick={() => router.get(archivedPatients.links.next, {}, { preserveState: true })}
                disabled={!archivedPatients.links.next}
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
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <FaUndo className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Restore Patient
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to restore "{selectedPatient?.name}"? This will make the patient active again.
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
                  className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Restore Patient
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
                  <FaExclamationTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Permanently Delete Patient
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you absolutely sure you want to permanently delete "{selectedPatient?.name}"? This action CANNOT be undone.
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
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <FaUndo className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Bulk Restore Patients
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Are you sure you want to restore {selectedPatients.length} patient(s)?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkRestoreModal(false)}
                  className="flex-1 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkRestore}
                  className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-white hover:shadow-lg transition-all"
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
                  <FaExclamationTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Bulk Permanent Delete
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Are you absolutely sure you want to permanently delete {selectedPatients.length} patient(s)? This action CANNOT be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBulkForceDeleteModal(false)}
                  className="flex-1 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkForceDelete}
                  className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-white hover:shadow-lg transition-all"
                >
                  Delete Permanently
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