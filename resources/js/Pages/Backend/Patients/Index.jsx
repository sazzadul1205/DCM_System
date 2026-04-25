// Pages/Backend/Patients/Index.jsx

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
  FaUserMd,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaVenusMars,
  FaTint,
  FaPrint,
  FaDownload,
  FaEye,
  FaArchive,
} from 'react-icons/fa';

export default function PatientsIndex({ patients, filters }) {
  // State
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);
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

  // Handle Single Status Update
  const handleStatusUpdate = async (patient, newStatus) => {
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Patient`,
      text: `Are you sure you want to ${action} "${patient.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'active' ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.patch(route('patients.update-status', patient.id), { status: newStatus }, {
        onSuccess: () => {
          showSuccessToast(`Patient ${action}d successfully!`);
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || `Failed to ${action} patient`);
        }
      });
    }
  };

  // Handle Delete Patient
  const handleDeleteClick = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      router.delete(route('patients.destroy', selectedPatient.id), {
        onSuccess: () => {
          setSelectedPatient(null);
          setSelectedPatients([]);
          setShowDeleteModal(false);
          showSuccessToast('Patient archived successfully!');
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || 'Failed to archive patient');
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
    if (selectedPatients.length === patients.data.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(patients.data.map(patient => patient.id));
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedPatients.length;

    const result = await Swal.fire({
      title: 'Bulk Archive',
      text: `Are you sure you want to archive ${count} patient(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, archive all!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setShowBulkDeleteModal(false);

    router.delete(route('patients.bulk.delete'), {
      data: { ids: selectedPatients },
      preserveScroll: true,
      onSuccess: () => {
        setSelectedPatients([]);
        showSuccessToast(`${count} patient(s) archived successfully!`);
      },
      onError: (errors) => {
        showErrorToast(
          Object.values(errors).flat()[0] || 'Failed to archive patients'
        );
      },
    });
  };

  const handleBulkStatusUpdate = async (status) => {
    const action = status === 'active' ? 'activate' : 'deactivate';
    const result = await Swal.fire({
      title: `Bulk ${action}`,
      text: `Are you sure you want to ${action} ${selectedPatients.length} patient(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'active' ? '#10b981' : '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.put(route('patients.bulk.status'), { ids: selectedPatients, status }, {
        onSuccess: () => {
          showSuccessToast(`${selectedPatients.length} patient(s) ${action}d successfully!`);
          setShowBulkStatusModal(false);
          setSelectedPatients([]);
        },
        onError: (errors) => {
          showErrorToast(Object.values(errors).flat()[0] || `Failed to ${action} patients`);
        }
      });
    }
  };

  // Handle Search and Filters
  const handleSearch = (e) => {
    router.get(route('patients.index'), {
      ...filters,
      search: e.target.value,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleStatusFilter = (status) => {
    router.get(route('patients.index'), {
      ...filters,
      status: status,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleGenderFilter = (gender) => {
    router.get(route('patients.index'), {
      ...filters,
      gender: gender,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleBloodGroupFilter = (bloodGroup) => {
    router.get(route('patients.index'), {
      ...filters,
      blood_group: bloodGroup,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleSort = (field) => {
    router.get(route('patients.index'), {
      ...filters,
      sort_field: field,
      sort_direction: filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc',
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePerPageChange = (perPage) => {
    router.get(route('patients.index'), {
      ...filters,
      per_page: perPage,
      page: 1,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handlePrint = () => {
    window.open(route('patients.print', filters), '_blank');
  };

  const handleExport = () => {
    window.location.href = route('patients.export', filters);
  };

  const getSortIcon = (field) => {
    if (filters.sort_field !== field) return <FaSort className="ml-1 h-4 w-4" />;
    return filters.sort_direction === 'asc'
      ? <FaSortUp className="ml-1 h-4 w-4" />
      : <FaSortDown className="ml-1 h-4 w-4" />;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Patient Management" />

      <div className="mx-auto py-6">

        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Patient Management
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage all registered patients and their medical records
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-gray-700"
              title="Print patients list"
            >
              <FaPrint className="h-4 w-4" />
              Print
            </button>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-green-700"
              title="Export to CSV"
            >
              <FaDownload className="h-4 w-4" />
              Export
            </button>

            <button
              onClick={() => router.get(route('patients.create'))}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
            >
              <FaPlus className="h-4 w-4" />
              Register New Patient
            </button>

            <button
              onClick={() => router.get(route('patients.archived'))}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-gray-700"
              title="View Archived Patients"
            >
              <FaArchive className="h-4 w-4" />
              Archived
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedPatients.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 shadow-sm animate-slideDown">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
                {selectedPatients.length}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                patient(s) selected
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
                onClick={() => setSelectedPatients([])}
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
                placeholder="Search by name, UID, phone, or email..."
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
            value={filters.gender}
            onChange={(e) => handleGenderFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white cursor-pointer"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filters.blood_group}
            onChange={(e) => handleBloodGroupFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white cursor-pointer"
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
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

        {/* Patients Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPatients.length === patients.data.length && patients.data.length > 0}
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
                  Details
                </th>
                <th
                  onClick={() => handleSort('registration_date')}
                  className="cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Reg. Date
                    {getSortIcon('registration_date')}
                  </div>
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
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {patients.data.map((patient) => (
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
                    <code className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {patient.patient_uid}
                    </code>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaUserMd className="text-gray-400" />
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {patient.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <FaPhone className="h-3 w-3" />
                        {patient.phone_primary}
                      </div>
                      {patient.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FaEnvelope className="h-3 w-3" />
                          {patient.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <FaVenusMars className="h-3 w-3 text-purple-500" />
                        <span className="capitalize text-gray-600 dark:text-gray-400">{patient.gender}</span>
                      </div>
                      {patient.blood_group && (
                        <div className="flex items-center gap-1 text-sm">
                          <FaTint className="h-3 w-3 text-red-500" />
                          <span className="text-gray-600 dark:text-gray-400">{patient.blood_group}</span>
                        </div>
                      )}
                      {patient.date_of_birth && (
                        <div className="flex items-center gap-1 text-sm">
                          <FaCalendarAlt className="h-3 w-3 text-blue-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {new Date(patient.date_of_birth).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(patient.registration_date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${patient.status === 'active'
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-300'
                        : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-300'
                        }`}>
                        {patient.status === 'active' ? <FaCheck className="h-2.5 w-2.5" /> : <FaBan className="h-2.5 w-2.5" />}
                        {patient.status}
                      </span>
                      <button
                        onClick={() => handleStatusUpdate(patient, patient.status === 'active' ? 'inactive' : 'active')}
                        className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title={`${patient.status === 'active' ? 'Deactivate' : 'Activate'} patient`}
                      >
                        {patient.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.get(route('patients.show', patient.id))}
                        className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                        title="View details"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.get(route('patients.edit', patient.id))}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Edit patient"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(patient)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Archive patient"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {patients.meta && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold">{patients.meta.from}</span> to{' '}
              <span className="font-semibold">{patients.meta.to}</span> of{' '}
              <span className="font-semibold">{patients.meta.total}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.get(patients.links.prev, {}, { preserveState: true })}
                disabled={!patients.links.prev}
                className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaChevronLeft className="h-3 w-3" />
                Previous
              </button>
              <button
                onClick={() => router.get(patients.links.next, {}, { preserveState: true })}
                disabled={!patients.links.next}
                className="flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <FaChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Single Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <FaTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Archive Patient
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to archive "{selectedPatient?.name}"? This action can be undone later.
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
                  Archive Patient
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
                  Bulk Archive Patients
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to archive {selectedPatients.length} patient(s)? This action can be undone later.
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
                  Archive All
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
                  Update status for {selectedPatients.length} patient(s)
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