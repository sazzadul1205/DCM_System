// Pages/Backend/Users/Show.jsx

// React
import { useState } from 'react';

// Inertia
import { Link, usePage } from '@inertiajs/react';

// Icons
import {
  FaEdit,
  FaKey,
  FaTrashAlt,
  FaUserCircle,
  FaEnvelope,
  FaIdCard,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaCheckCircle,
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Components
import ChangePasswordModal from './ChangePasswordModal';
import DeleteProfileModal from './DeleteProfileModal';

export default function Show({ user }) {
  // Page Props
  const { flash = {} } = usePage().props;

  // Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <AuthenticatedLayout>
      <div className="mx-auto py-6">
        {flash.status && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
            {flash.status}
          </div>
        )}

        {/* Header with Title */}
        <div className='flex justify-between'>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">View and manage your profile information</p>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Link
              href={route('profile.edit')}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <FaEdit className="h-4 w-4" />
              Edit Profile
            </Link>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-yellow-600 hover:shadow focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
            >
              <FaKey className="h-4 w-4" />
              Change Password
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              <FaTrashAlt className="h-4 w-4" />
              Delete Profile
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

          {/* Profile Info Section */}
          <div className="relative px-6">

            {/* Avatar + Name Row */}
            <div className="flex flex-row justify-between gap-4 py-2">

              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <FaUserCircle className="h-12 w-12 sm:h-14 sm:w-14 text-white" />
                </div>

                {/* User Details */}
                <div>
                  <div className="text-xl flex gap-5 font-bold text-gray-900 dark:text-white">
                    <p>{user.name}</p>

                    {/* Role */}
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-200 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <FaShieldAlt className="h-3 w-3" />
                      {user.role?.name || 'Member'}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {/* UID */}
                    <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <FaIdCard className="h-3 w-3" />
                      {user.uid}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Status */}
              <div className="self-start sm:self-auto">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  <FaCheckCircle className="h-3 w-3" />
                  Verified Account
                </span>
              </div>

            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700"></div>

          {/* Contact Information */}
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <FaEnvelope className="text-blue-600" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Primary Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.phone_primary}</p>
                </div>
                {user.phone_secondary && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Secondary Phone</p>
                    <p className="text-sm text-gray-900 dark:text-white">{user.phone_secondary}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <FaUserCircle className="text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.blood_group || '—'}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                  <p className="text-sm capitalize text-gray-900 dark:text-white">{user.gender || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        {(user.address_details || user.address_district || user.address_division) && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <FaMapMarkerAlt className="text-blue-600" />
                Address Information
              </h3>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              {user.address_details && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Address Details</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.address_details}</p>
                </div>
              )}
              {user.address_police_station && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Police Station</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.address_police_station}</p>
                </div>
              )}
              {user.address_district && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">District</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.address_district}</p>
                </div>
              )}
              {user.address_division && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Division</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.address_division}</p>
                </div>
              )}
              {user.address_postal_code && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Postal Code</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.address_postal_code}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emergency Contact Section */}
        {(user.emergency_contact_name || user.emergency_contact_phone) && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <FaHeartbeat className="text-red-600" />
                Emergency Contact
              </h3>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              {user.emergency_contact_name && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Contact Name</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.emergency_contact_name}</p>
                </div>
              )}
              {user.emergency_contact_phone && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Contact Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white">{user.emergency_contact_phone}</p>
                </div>
              )}
              {user.emergency_contact_relation && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Relationship</p>
                  <p className="text-sm capitalize text-gray-900 dark:text-white">{user.emergency_contact_relation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Last updated: {new Date(user.updated_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <DeleteProfileModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

    </AuthenticatedLayout>
  );
}
