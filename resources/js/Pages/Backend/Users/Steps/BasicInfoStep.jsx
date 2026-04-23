// Pages/Profile/Steps/BasicInfoStep.jsx

import FormField from '@/Components/FormField';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPhoneAlt,
  FaTint,
  FaCalendarAlt,
  FaVenusMars,
  FaIdCard
} from 'react-icons/fa';

export default function BasicInfoStep({ data, setData, errors, user }) {
  const bloodGroups = [
    { value: 'A+', label: 'A Positive (A+)' },
    { value: 'A-', label: 'A Negative (A-)' },
    { value: 'B+', label: 'B Positive (B+)' },
    { value: 'B-', label: 'B Negative (B-)' },
    { value: 'AB+', label: 'AB Positive (AB+)' },
    { value: 'AB-', label: 'AB Negative (AB-)' },
    { value: 'O+', label: 'O Positive (O+)' },
    { value: 'O-', label: 'O Negative (O-)' },
  ];

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaUser className="text-blue-600" />
          Basic Information
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* UID (Read Only) */}
          {user?.uid && (
            <div className="col-span-2">
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3 dark:from-blue-900/20 dark:to-purple-900/20">
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaIdCard className="h-4 w-4" />
                  User ID (UID)
                </label>
                <p className="font-mono text-lg font-semibold text-gray-900 dark:text-white">{user?.uid}</p>
              </div>
            </div>
          )}

          {/* Name */}
          <FormField
            id="name"
            name="name"
            type="text"
            label="Full Name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            error={errors.name}
            icon={FaUser}
            placeholder="Enter your full name"
            required
          />

          {/* Email */}
          <FormField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            error={errors.email}
            icon={FaEnvelope}
            placeholder="Enter your email"
            required
          />

          {/* Primary Phone */}
          <FormField
            id="phone_primary"
            name="phone_primary"
            type="tel"
            label="Primary Phone"
            value={data.phone_primary}
            onChange={(e) => setData('phone_primary', e.target.value)}
            error={errors.phone_primary}
            icon={FaPhone}
            placeholder="+880 1XXX-XXXXXX"
            required
          />

          {/* Secondary Phone */}
          <FormField
            id="phone_secondary"
            name="phone_secondary"
            type="tel"
            label="Secondary Phone (Optional)"
            value={data.phone_secondary}
            onChange={(e) => setData('phone_secondary', e.target.value)}
            error={errors.phone_secondary}
            icon={FaPhoneAlt}
            placeholder="+880 1XXX-XXXXXX"
          />

          {/* Blood Group */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Blood Group <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaTint className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={data.blood_group}
                onChange={(e) => setData('blood_group', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg.value} value={bg.value}>{bg.label}</option>
                ))}
              </select>
            </div>
            {errors.blood_group && <p className="text-sm text-red-600">{errors.blood_group}</p>}
          </div>

          {/* Date of Birth */}
          <FormField
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            label="Date of Birth"
            value={data.date_of_birth}
            onChange={(e) => setData('date_of_birth', e.target.value)}
            error={errors.date_of_birth}
            icon={FaCalendarAlt}
          />

          {/* Gender */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaVenusMars className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={data.gender}
                onChange={(e) => setData('gender', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Gender</option>
                {genders.map((gender) => (
                  <option key={gender.value} value={gender.value}>{gender.label}</option>
                ))}
              </select>
            </div>
            {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}