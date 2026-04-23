// Pages/Profile/Steps/PreviewStep.jsx

import {
  FaCheckCircle,
  FaEdit,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPhoneAlt,
  FaTint,
  FaCalendarAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaCity,
  FaLocationArrow,
  FaBuilding,
  FaHeartbeat,
  FaUserFriends,
  FaSave,
  FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';

// InfoCard Component - Defined OUTSIDE PreviewStep
const InfoCard = ({ title, icon, children, step, onEditClick }) => (
  <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden w-full">
    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4 dark:border-gray-700 dark:from-gray-800 dark:to-blue-900/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-blue-600 dark:text-blue-400">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onEditClick(step)}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          <FaEdit className="h-3 w-3" />
          Edit
        </button>
      </div>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

// InfoRow Component - Defined OUTSIDE PreviewStep
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start space-x-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="flex-shrink-0 mt-0.5">
      {Icon && <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
    </div>
    <div className="flex-1">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <p className="text-sm text-gray-900 dark:text-white mt-0.5">{value || 'Not provided'}</p>
    </div>
  </div>
);

export default function PreviewStep({ data, user, onEdit, isSubmitting }) {

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatBloodGroup = (bg) => {
    if (!bg) return 'Not provided';
    const groups = {
      'A+': 'A Positive (A+)',
      'A-': 'A Negative (A-)',
      'B+': 'B Positive (B+)',
      'B-': 'B Negative (B-)',
      'AB+': 'AB Positive (AB+)',
      'AB-': 'AB Negative (AB-)',
      'O+': 'O Positive (O+)',
      'O-': 'O Negative (O-)',
    };
    return groups[bg] || bg;
  };

  const formatGender = (gender) => {
    if (!gender) return 'Not provided';
    const genders = {
      male: 'Male',
      female: 'Female',
      other: 'Other'
    };
    return genders[gender] || gender;
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Alert */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20 w-full">
        <div className="flex items-start gap-3">
          <FaCheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-300">Review Your Information</h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              Please review all the information below before submitting. Make sure everything is correct.
              You can edit any section by clicking the Edit button.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information Card */}
      <InfoCard
        title="Basic Information"
        icon={<FaUser className="h-5 w-5" />}
        step={1}
        onEditClick={onEdit}
      >
        <div className="grid gap-0 md:grid-cols-2">
          {/* UID */}
          {user?.uid && (
            <div className="col-span-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3 dark:from-blue-900/20 dark:to-purple-900/20">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">User ID (UID)</span>
                <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{user.uid}</p>
              </div>
            </div>
          )}

          <InfoRow label="Full Name" value={data.name} icon={FaUser} />
          <InfoRow label="Email Address" value={data.email} icon={FaEnvelope} />
          <InfoRow label="Primary Phone" value={data.phone_primary} icon={FaPhone} />
          <InfoRow label="Secondary Phone" value={data.phone_secondary || 'Not provided'} icon={FaPhoneAlt} />
          <InfoRow label="Blood Group" value={formatBloodGroup(data.blood_group)} icon={FaTint} />
          <InfoRow label="Date of Birth" value={formatDate(data.date_of_birth)} icon={FaCalendarAlt} />
          <InfoRow label="Gender" value={formatGender(data.gender)} icon={FaVenusMars} />
        </div>
      </InfoCard>

      {/* Address Information Card */}
      <InfoCard
        title="Address Information"
        icon={<FaMapMarkerAlt className="h-5 w-5" />}
        step={2}
        onEditClick={onEdit}
      >
        <div className="grid gap-0 md:grid-cols-2">
          <InfoRow label="Division" value={data.address_division || 'Not provided'} icon={FaLocationArrow} />
          <InfoRow label="District" value={data.address_district || 'Not provided'} icon={FaCity} />
          <InfoRow label="Police Station / Thana" value={data.address_police_station || 'Not provided'} icon={FaMapMarkerAlt} />
          <InfoRow label="Postal Code" value={data.address_postal_code || 'Not provided'} icon={FaLocationArrow} />
          <div className="col-span-2">
            <InfoRow label="Address Details" value={data.address_details || 'Not provided'} icon={FaBuilding} />
          </div>
        </div>
      </InfoCard>

      {/* Emergency Contact Card */}
      <InfoCard
        title="Emergency Contact"
        icon={<FaHeartbeat className="h-5 w-5" />}
        step={3}
        onEditClick={onEdit}
      >
        <div className="grid gap-0 md:grid-cols-2">
          <InfoRow label="Contact Name" value={data.emergency_contact_name || 'Not provided'} icon={FaUserFriends} />
          <InfoRow label="Contact Phone" value={data.emergency_contact_phone || 'Not provided'} icon={FaPhone} />
          <InfoRow label="Relationship" value={data.emergency_contact_relation || 'Not provided'} icon={FaUser} />
        </div>
      </InfoCard>

      {/* Warning Alert */}
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20 w-full">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">Before You Submit</h3>
            <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-400 list-disc list-inside space-y-1">
              <li>Ensure all information is accurate and up-to-date</li>
              <li>Your contact information will be used for emergency purposes</li>
              <li>You can update this information later from your profile settings</li>
              <li>By submitting, you confirm that the information provided is correct</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button Section - ONLY HERE, NO AUTO SUBMIT */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 w-full">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <FaShieldAlt className="mx-auto h-12 w-12 text-green-600 dark:text-green-500 mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ready to Submit?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Click the button below to complete your profile setup
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onEdit(3)}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FaEdit className="mr-2 h-4 w-4" />
              Go Back to Edit
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:from-green-700 hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <FaSave className="mr-2 h-5 w-5" />
                  Confirm & Complete Profile
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            ⚠️ This action cannot be undone. Please review all information before submitting.
          </p>
        </div>
      </div>
    </div>
  );
}