// Pages/Backend/Patients/Show.jsx

// React
import { useState, useRef, useEffect } from 'react';

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
  FaIdCard,
  FaDownload,
  FaQrcode,
} from 'react-icons/fa';

// For barcode generation
import JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';

export default function Show({ patient, allergies, medicalConditions, medications }) {
  const [activeTab, setActiveTab] = useState('overview');
  const barcodeRef = useRef(null);
  const idCardRef = useRef(null);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format date for ID card (short format)
  const formatShortDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Generate barcode when ID card tab is opened - FIXED: using useEffect instead of useState
  useEffect(() => {
    if (activeTab === 'id-card' && barcodeRef.current) {
      try {
        // Clear any existing barcode
        while (barcodeRef.current.firstChild) {
          barcodeRef.current.removeChild(barcodeRef.current.firstChild);
        }

        // Generate new barcode
        JsBarcode(barcodeRef.current, patient.patient_uid, {
          format: 'CODE128',
          lineColor: '#000',
          width: 1,
          height: 50,
          displayValue: true,
          fontSize: 14,
          margin: 10,
        });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [activeTab, patient.patient_uid]);

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

  // Handle download ID card as image
  const handleDownloadIdCard = async () => {
    if (idCardRef.current) {
      try {
        const canvas = await html2canvas(idCardRef.current, {
          scale: 2,
          backgroundColor: null,
        });
        const link = document.createElement('a');
        link.download = `id-card-${patient.patient_uid}.png`;
        link.href = canvas.toDataURL();
        link.click();

        Swal.fire({
          icon: 'success',
          title: 'Downloaded!',
          text: 'ID Card downloaded successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Failed to download ID card. ${error}`,
        });
      }
    }
  };

  // Handle print ID card
  const handlePrintIdCard = () => {
    const printWindow = window.open('', '_blank');
    const idCardHtml = document.getElementById('id-card-print').innerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Patient ID Card - ${patient.name}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f0f0f0;
              font-family: Arial, sans-serif;
            }
            .id-card {
              max-width: 400px;
              margin: 0 auto;
            }
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="id-card">
            ${idCardHtml}
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
    { id: 'id-card', label: 'ID Card', icon: FaIdCard },
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
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</dt>
                    <dd className="text-gray-900 dark:text-white">{calculateAge(patient.date_of_birth)} years</dd>
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

          {/* Medical Records Tab - Improved Design with React Icons */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              {/* Allergies Section */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                        <FaAllergies className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Allergies</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {allergies?.length || 0} recorded allergy{allergies?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {allergies?.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                        {allergies.length} Total
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {allergies?.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                        <FaAllergies className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No allergies recorded</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Patient has no known allergies</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {allergies.map((allergy, idx) => (
                        <div key={idx} className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-semibold text-gray-900 dark:text-white">{allergy.allergy_name}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  {allergy.allergy_type}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityBadge(allergy.severity)}`}>
                                  {allergy.severity}
                                </span>
                              </div>
                              {allergy.reaction_notes && (
                                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                                    <FaAllergies className="h-3 w-3" /> Reaction:
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{allergy.reaction_notes}</p>
                                </div>
                              )}
                              {allergy.diagnosed_date && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Diagnosed: {formatDate(allergy.diagnosed_date)}
                                </p>
                              )}
                            </div>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Conditions Section */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                        <FaHeartbeat className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Conditions</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {medicalConditions?.length || 0} recorded condition{medicalConditions?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {medicalConditions?.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                        {medicalConditions.length} Total
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {medicalConditions?.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                        <FaHeartbeat className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No medical conditions recorded</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No health conditions documented</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {medicalConditions.map((condition, idx) => (
                        <div key={idx} className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-semibold text-gray-900 dark:text-white">{condition.condition_name}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  {condition.category}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityBadge(condition.severity)}`}>
                                  {condition.severity}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${condition.is_active
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                  }`}>
                                  {condition.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              {condition.diagnosed_date && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Diagnosed: {formatDate(condition.diagnosed_date)}
                                </p>
                              )}
                              {condition.notes && (
                                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Notes:
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{condition.notes}</p>
                                </div>
                              )}
                            </div>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Medications Section */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                        <FaPills className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Medications</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {medications?.length || 0} recorded medication{medications?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {medications?.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                        {medications.length} Total
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {medications?.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                        <FaPills className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No medications recorded</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No active or past medications documented</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {medications.map((medication, idx) => (
                        <div key={idx} className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-semibold text-gray-900 dark:text-white">{medication.medication_name}</span>
                                {medication.dosage && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                                    <svg className="h-3 w-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 5-3-2-3 2-1-5z" />
                                    </svg>
                                    {medication.dosage}
                                  </span>
                                )}
                                {medication.frequency && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 font-medium">
                                    <svg className="h-3 w-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {medication.frequency}
                                  </span>
                                )}
                              </div>
                              {(medication.start_date || medication.end_date) && (
                                <div className="flex items-center gap-3 mt-2 text-sm">
                                  {medication.start_date && (
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      Start: {formatDate(medication.start_date)}
                                    </span>
                                  )}
                                  {medication.end_date && (
                                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      End: {formatDate(medication.end_date)}
                                    </span>
                                  )}
                                </div>
                              )}
                              {medication.notes && (
                                <div className="mt-2 p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg">
                                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Instructions:
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{medication.notes}</p>
                                </div>
                              )}
                            </div>
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Individual Tabs - Improved Design with React Icons */}
          {activeTab === 'allergies' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <FaAllergies className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Allergies</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Complete list of patient allergies</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {allergies?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <FaAllergies className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Allergies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This patient has no known allergies</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {allergies.map((allergy, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{allergy.allergy_name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                {allergy.allergy_type}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityBadge(allergy.severity)}`}>
                                {allergy.severity}
                              </span>
                            </div>
                          </div>
                        </div>
                        {allergy.reaction_notes && (
                          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                              <FaAllergies className="h-3 w-3" /> Reaction
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{allergy.reaction_notes}</p>
                          </div>
                        )}
                        {allergy.diagnosed_date && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Diagnosed: {formatDate(allergy.diagnosed_date)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'conditions' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                    <FaHeartbeat className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Conditions</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Complete list of medical conditions</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {medicalConditions?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <FaHeartbeat className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Conditions</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No medical conditions documented</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {medicalConditions.map((condition, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{condition.condition_name}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                {condition.category}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityBadge(condition.severity)}`}>
                                {condition.severity}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${condition.is_active
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                }`}>
                                {condition.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {condition.diagnosed_date && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Diagnosed: {formatDate(condition.diagnosed_date)}
                          </p>
                        )}
                        {condition.notes && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Notes
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{condition.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <FaPills className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Medications</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Complete list of medications</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {medications?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <FaPills className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Medications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No medications documented</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {medications.map((medication, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                        <div className="mb-3">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{medication.medication_name}</h3>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {medication.dosage && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium flex items-center gap-1">
                                <FaPills className="h-3 w-3" />
                                {medication.dosage}
                              </span>
                            )}
                            {medication.frequency && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 font-medium flex items-center gap-1">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {medication.frequency}
                              </span>
                            )}
                          </div>
                        </div>
                        {(medication.start_date || medication.end_date) && (
                          <div className="flex flex-col gap-1 mt-3 text-sm">
                            {medication.start_date && (
                              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Started: {formatDate(medication.start_date)}
                              </p>
                            )}
                            {medication.end_date && (
                              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Ended: {formatDate(medication.end_date)}
                              </p>
                            )}
                          </div>
                        )}
                        {medication.notes && (
                          <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg">
                            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1">
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Instructions
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{medication.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ID Card Tab */}
          {activeTab === 'id-card' && (
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handlePrintIdCard}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  <FaPrint className="h-4 w-4" />
                  Print ID Card
                </button>
                <button
                  onClick={handleDownloadIdCard}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  <FaDownload className="h-4 w-4" />
                  Download ID Card
                </button>
              </div>

              {/* ID Card Container */}
              <div className="flex justify-center">
                <div id="id-card-print" ref={idCardRef}>
                  <div className="w-[400px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white text-center">
                      <FaIdCard className="h-8 w-8 mx-auto mb-2 opacity-80" />
                      <h3 className="text-xl font-bold">Patient ID Card</h3>
                      <p className="text-xs opacity-80">Medical Identification</p>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Barcode Section */}
                      <div className="mb-6 text-center">
                        <svg ref={barcodeRef} className="mx-auto"></svg>
                        <p className="text-xs text-gray-500 mt-2 font-mono">{patient.patient_uid}</p>
                      </div>

                      {/* Patient Photo Placeholder */}
                      <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center">
                          <FaUser className="h-12 w-12 text-blue-600" />
                        </div>
                      </div>

                      {/* Patient Information */}
                      <div className="space-y-3">
                        <div className="text-center border-b border-gray-200 pb-3">
                          <h4 className="text-lg font-bold text-gray-800">{patient.name}</h4>
                          <p className="text-xs text-gray-500">Patient</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Patient ID</p>
                            <p className="font-mono text-xs font-semibold text-gray-800">{patient.patient_uid}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Blood Group</p>
                            <p className="font-semibold text-gray-800">{patient.blood_group || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="font-semibold text-gray-800 capitalize">{patient.gender}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Age</p>
                            <p className="font-semibold text-gray-800">{calculateAge(patient.date_of_birth)} years</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-semibold text-gray-800">{patient.phone_primary}</p>
                          </div>
                          {patient.blood_group && (
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500">Emergency Contact</p>
                              <p className="font-semibold text-gray-800">
                                {patient.emergency_contact_name || 'Not provided'}
                                {patient.emergency_contact_phone && ` (${patient.emergency_contact_phone})`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Valid Date */}
                      <div className="mt-6 pt-3 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500">Valid From: {formatShortDate(patient.registration_date)}</p>
                        <p className="text-[10px] text-gray-400 mt-1">This card is the property of the medical facility</p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="bg-gray-100 px-6 py-2 text-center">
                      <FaQrcode className="h-4 w-4 inline-block mr-1 text-gray-500" />
                      <span className="text-[10px] text-gray-500">Scan barcode for patient records</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ID Card Instructions */}
              <div className="rounded-xl border border-gray-200 bg-blue-50 p-4 dark:bg-blue-900/20">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">ID Card Instructions</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Click "Print ID Card" to print a physical copy</li>
                  <li>• Click "Download ID Card" to save as an image</li>
                  <li>• The barcode contains the patient's unique ID</li>
                  <li>• Keep this card for medical identification purposes</li>
                </ul>
              </div>
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