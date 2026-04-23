// Pages/Backend/Users/Edit.jsx

// React
import { useState } from 'react';

// Inertia
import { Head, useForm, Link } from '@inertiajs/react';

// Icons
import {
  FaUser,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaSave,
  FaArrowLeft,
  FaInfoCircle
} from 'react-icons/fa';

// Components
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Import your existing step components
import AddressStep from './Steps/AddressStep';
import EmergencyStep from './Steps/EmergencyStep';
import BasicInfoStep from './Steps/BasicInfoStep';

// SweetAlert2
import Swal from 'sweetalert2';

export default function Edit({ user }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data with existing user values - CHANGE 'post' to 'put'
  const { data, setData, put, processing, errors } = useForm({
    // Basic Info
    name: user?.name || '',
    email: user?.email || '',
    phone_primary: user?.phone_primary || '',
    phone_secondary: user?.phone_secondary || '',
    blood_group: user?.blood_group || '',
    date_of_birth: user?.date_of_birth || '',
    gender: user?.gender || '',
    // Address Info
    address_division: user?.address_division || '',
    address_district: user?.address_district || '',
    address_police_station: user?.address_police_station || '',
    address_postal_code: user?.address_postal_code || '',
    address_details: user?.address_details || '',
    // Emergency Contact
    emergency_contact_name: user?.emergency_contact_name || '',
    emergency_contact_phone: user?.emergency_contact_phone || '',
    emergency_contact_relation: user?.emergency_contact_relation || '',
  });

  // Tabs configuration
  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: FaUser },
    { id: 'address', label: 'Address Information', icon: FaMapMarkerAlt },
    { id: 'emergency', label: 'Emergency Contact', icon: FaHeartbeat },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Show confirmation dialog
    Swal.fire({
      title: 'Save Changes?',
      text: 'Are you sure you want to update your profile?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save changes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // CHANGE FROM 'post' TO 'put'
        put(route('profile.update'), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              title: 'Success!',
              text: 'Profile updated successfully.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              timer: 2000,
            });
            setIsSubmitting(false);
          },
          onError: (errors) => {
            console.error('Update failed:', errors);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update profile. Please check your inputs.',
              icon: 'error',
              confirmButtonColor: '#d33',
            });
            setIsSubmitting(false);
          },
          onFinish: () => {
            setIsSubmitting(false);
          }
        });
      } else {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Edit Profile" />

      <div className="mx-auto py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={route('profile.show')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FaArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Update your personal information and preferences
            </p>
          </div>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={isSubmitting || processing}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting || processing ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Form */}
        <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <BasicInfoStep
                data={data}
                setData={setData}
                errors={errors}
                user={user}
              />

              {/* Info Box */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-semibold">Need help?</p>
                    <p className="mt-1">
                      Your email and phone number can be used for account recovery and notifications.
                      Keep them up to date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Address Information Tab */}
          {activeTab === 'address' && (
            <AddressStep
              data={data}
              setData={setData}
              errors={errors}
            />
          )}

          {/* Emergency Contact Tab */}
          {activeTab === 'emergency' && (
            <EmergencyStep
              data={data}
              setData={setData}
              errors={errors}
            />
          )}
        </form>
      </div>
    </AuthenticatedLayout>
  );
}