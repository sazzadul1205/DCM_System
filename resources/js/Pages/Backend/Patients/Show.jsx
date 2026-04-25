// Pages/Backend/Patients/Show.jsx

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
  FaEdit,
  FaTrash,
  FaUser,
  FaMapMarkerAlt,
  FaAmbulance,
  FaHeartbeat,
  FaUserMd,
  FaAllergies,
  FaPills,
  FaCheckCircle,
  FaBan,
  FaPrint,
} from 'react-icons/fa';

export default function Show({ patient, allergies, medicalConditions, medications }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    const newStatus = patient.status === 'active' ? 'inactive' : 'active';
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
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Patient ${action}d successfully!`,
            timer: 2000,
            showConfirmButton: false,
          });
        },
        onError: (errors) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: Object.values(errors).flat()[0] || `Failed to ${action} patient`,
          });
        }
      });
    }
  };

  // Handle delete/archive
  const handleArchive = async () => {
    const result = await Swal.fire({
      title: 'Archive Patient',
      text: `Are you sure you want to archive "${patient.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, archive!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      router.delete(route('patients.destroy', patient.id), {
        onSuccess: () => {
          Swal.fire({
            icon: 'success',
            title: 'Archived!',
            text: 'Patient has been archived.',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            router.get(route('patients.index'));
          });
        },
        onError: (errors) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: Object.values(errors).flat()[0] || 'Failed to archive patient',
          });
        }
      });
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Get severity badge color
  const getSeverityBadge = (severity) => {
    const colors = {
      Mild: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      Moderate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      Severe: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      life_threatening: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[severity] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaUser },
    { id: 'medical', label: 'Medical Records', icon: FaHeartbeat },
    { id: 'allergies', label: 'Allergies', icon: FaAllergies, count: allergies?.length },
    { id: 'conditions', label: 'Conditions', icon: FaHeartbeat, count: medicalConditions?.length },
    { id: 'medications', label: 'Medications', icon: FaPills, count: medications?.length },
  ];

  return (
    <AuthenticatedLayout>
      <Head title={`Patient: ${patient.name}`} />

      <div className="w-full min-h-screen pb-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-2xl shadow-lg mb-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.get(route('patients.index'))}
                  className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  <FaArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-white">{patient.name}</h1>
                    <code className="px-2 py-1 bg-white/20 rounded-lg text-sm font-mono text-white">
                      {patient.patient_uid}
                    </code>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${patient.status === 'active'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                      }`}>
                      {patient.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm mt-1">
                    Registered on {formatDate(patient.registration_date)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  <FaPrint className="h-4 w-4" />
                  Print
                </button>
                <button
                  onClick={() => router.get(route('patients.edit', patient.id))}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  <FaEdit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
                >
                  {patient.status === 'active' ? <FaBan className="h-4 w-4" /> : <FaCheckCircle className="h-4 w-4" />}
                  {patient.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={handleArchive}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-lg text-white hover:bg-red-500/30 transition-all"
                >
                  <FaTrash className="h-4 w-4" />
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Basic Information
                </h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.name}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient UID</dt>
                    <dd className="font-mono text-gray-900 dark:text-white">{patient.patient_uid}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.email || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Phone</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.phone_primary}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Secondary Phone</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.phone_secondary || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</dt>
                    <dd className="text-gray-900 dark:text-white capitalize">{patient.gender}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</dt>
                    <dd className="text-gray-900 dark:text-white">{formatDate(patient.date_of_birth)}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Group</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.blood_group || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Date</dt>
                    <dd className="text-gray-900 dark:text-white">{formatDate(patient.registration_date)}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                    <dd>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${patient.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                        {patient.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Emergency Contact */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaAmbulance className="text-red-600" />
                  Emergency Contact
                </h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Name</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.emergency_contact_name || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Phone</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.emergency_contact_phone || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Relationship</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.emergency_contact_relation || '-'}</dd>
                  </div>
                </dl>
              </div>

              {/* Address Information */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  Address Information
                </h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Division</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.address_division || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">District</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.address_district || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Police Station / Thana</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.address_police_station || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Postal Code</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.address_postal_code || '-'}</dd>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address Details</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.address_details || '-'}</dd>
                  </div>
                </dl>
              </div>

              {/* Referral Information */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaUserMd className="text-purple-600" />
                  Referral Information
                </h2>
                <dl className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Referred By</dt>
                    <dd className="text-gray-900 dark:text-white">
                      {patient.referred_by?.name || patient.referred_by_user_id || '-'}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Referral Source</dt>
                    <dd className="text-gray-900 dark:text-white capitalize">
                      {patient.referral_source ? patient.referral_source.replace('_', ' ') : '-'}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Referral Notes</dt>
                    <dd className="text-gray-900 dark:text-white">{patient.referral_notes || '-'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              {/* Allergies Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaAllergies className="text-purple-600" />
                  Allergies
                </h2>
                {allergies?.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 italic">No allergies recorded</p>
                ) : (
                  <div className="space-y-3">
                    {allergies.map((allergy, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-medium text-gray-900 dark:text-white">{allergy.allergy_name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                            {allergy.allergy_type}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityBadge(allergy.severity)}`}>
                            {allergy.severity}
                          </span>
                        </div>
                        {allergy.reaction_notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">Reaction: {allergy.reaction_notes}</p>
                        )}
                        {allergy.diagnosed_date && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Diagnosed: {formatDate(allergy.diagnosed_date)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medical Conditions Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaHeartbeat className="text-red-600" />
                  Medical Conditions
                </h2>
                {medicalConditions?.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 italic">No medical conditions recorded</p>
                ) : (
                  <div className="space-y-3">
                    {medicalConditions.map((condition, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-medium text-gray-900 dark:text-white">{condition.condition_name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                            {condition.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityBadge(condition.severity)}`}>
                            {condition.severity}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${condition.is_active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                            {condition.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {condition.diagnosed_date && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Diagnosed: {formatDate(condition.diagnosed_date)}
                          </p>
                        )}
                        {condition.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Notes: {condition.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medications Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaPills className="text-green-600" />
                  Medications
                </h2>
                {medications?.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 italic">No medications recorded</p>
                ) : (
                  <div className="space-y-3">
                    {medications.map((medication, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-medium text-gray-900 dark:text-white">{medication.medication_name}</span>
                          {medication.dosage && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {medication.dosage}
                            </span>
                          )}
                        </div>
                        {medication.frequency && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">Frequency: {medication.frequency}</p>
                        )}
                        {(medication.start_date || medication.end_date) && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {medication.start_date && <>Start: {formatDate(medication.start_date)}</>}
                            {medication.start_date && medication.end_date && <> | </>}
                            {medication.end_date && <>End: {formatDate(medication.end_date)}</>}
                          </p>
                        )}
                        {medication.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Instructions: {medication.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Individual Tabs for Allergies, Conditions, Medications */}
          {activeTab === 'allergies' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FaAllergies className="text-purple-600" />
                Allergies
              </h2>
              {allergies?.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">No allergies recorded</p>
              ) : (
                <div className="space-y-3">
                  {allergies.map((allergy, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-medium text-gray-900 dark:text-white">{allergy.allergy_name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                          {allergy.allergy_type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityBadge(allergy.severity)}`}>
                          {allergy.severity}
                        </span>
                      </div>
                      {allergy.reaction_notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Reaction: {allergy.reaction_notes}</p>
                      )}
                      {allergy.diagnosed_date && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Diagnosed: {formatDate(allergy.diagnosed_date)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'conditions' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FaHeartbeat className="text-red-600" />
                Medical Conditions
              </h2>
              {medicalConditions?.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">No medical conditions recorded</p>
              ) : (
                <div className="space-y-3">
                  {medicalConditions.map((condition, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-medium text-gray-900 dark:text-white">{condition.condition_name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                          {condition.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityBadge(condition.severity)}`}>
                          {condition.severity}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${condition.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                          {condition.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {condition.diagnosed_date && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Diagnosed: {formatDate(condition.diagnosed_date)}
                        </p>
                      )}
                      {condition.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Notes: {condition.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FaPills className="text-green-600" />
                Medications
              </h2>
              {medications?.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">No medications recorded</p>
              ) : (
                <div className="space-y-3">
                  {medications.map((medication, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-medium text-gray-900 dark:text-white">{medication.medication_name}</span>
                        {medication.dosage && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {medication.dosage}
                          </span>
                        )}
                      </div>
                      {medication.frequency && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Frequency: {medication.frequency}</p>
                      )}
                      {(medication.start_date || medication.end_date) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {medication.start_date && <>Start: {formatDate(medication.start_date)}</>}
                          {medication.start_date && medication.end_date && <> | </>}
                          {medication.end_date && <>End: {formatDate(medication.end_date)}</>}
                        </p>
                      )}
                      {medication.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Instructions: {medication.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .rounded-xl, .rounded-xl * {
            visibility: visible;
          }
          .rounded-xl {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
          }
          button, .bg-gradient-to-r {
            display: none;
          }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}