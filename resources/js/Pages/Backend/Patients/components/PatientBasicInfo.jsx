// Pages/Backend/Patients/components/PatientBasicInfo.jsx

import FormField from '@/Components/FormField';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPhoneAlt,
  FaTint,
  FaCalendarAlt,
  FaVenusMars,
} from 'react-icons/fa';

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

export default function PatientBasicInfo({ data, setData, errors }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaUser className="text-blue-600" />
          Basic Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
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
            placeholder="Enter patient's full name"
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
            placeholder="patient@example.com"
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
            label="Secondary Phone"
            value={data.phone_secondary}
            onChange={(e) => setData('phone_secondary', e.target.value)}
            error={errors.phone_secondary}
            icon={FaPhoneAlt}
            placeholder="+880 1XXX-XXXXXX (Optional)"
          />

          {/* Gender */}
          <FormField
            id="gender"
            name="gender"
            type="select"
            label="Gender"
            value={data.gender}
            onChange={(e) => setData('gender', e.target.value)}
            error={errors.gender}
            icon={FaVenusMars}
            options={genders}
            placeholder="Select Gender"
            required
          />

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
            required
          />

          {/* Blood Group */}
          <FormField
            id="blood_group"
            name="blood_group"
            type="select"
            label="Blood Group"
            value={data.blood_group}
            onChange={(e) => setData('blood_group', e.target.value)}
            error={errors.blood_group}
            icon={FaTint}
            options={bloodGroups}
            placeholder="Select Blood Group"
          />
        </div>
      </div>
    </div>
  );
}