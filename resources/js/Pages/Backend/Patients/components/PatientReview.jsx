// Pages/Backend/Patients/components/PatientReview.jsx

import { FaEdit, FaUser, FaAmbulance, FaHome, FaUserMd, FaAllergies, FaHeartbeat, FaPills, FaCheckCircle, FaClock, FaPhone, FaEnvelope, FaCalendarAlt, FaVenusMars, FaTint, FaMapMarkerAlt, FaCity, FaBuilding, FaMailBulk, FaStickyNote, FaNotesMedical, FaGlobe } from 'react-icons/fa';

export default function PatientReview({ data, onEdit, isSubmitting }) {
  // Helper to jump to a step (1-based indexing for steps)
  const jumpToStep = (stepNumber) => {
    onEdit(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Mild': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Severe': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 shadow-sm dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
            <FaCheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Patient Information</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-12">
          Please verify all details. Click the edit icon next to each section to make changes.
        </p>
      </div>

      {/* Basic Info */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden group relative hover:shadow-md transition-all duration-200">
        <button
          onClick={() => jumpToStep(1)}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          title="Edit Basic Information"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <FaUser className="text-blue-600 dark:text-blue-400 h-4 w-4" />
            </div>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          </div>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <FaUser className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Full Name</dt>
                <dd className="text-gray-900 dark:text-white font-medium">{data.name || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaEnvelope className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Email Address</dt>
                <dd className="text-gray-900 dark:text-white">{data.email || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaPhone className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Primary Phone</dt>
                <dd className="text-gray-900 dark:text-white">{data.phone_primary || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaPhone className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Secondary Phone</dt>
                <dd className="text-gray-900 dark:text-white">{data.phone_secondary || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaVenusMars className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Gender</dt>
                <dd className="text-gray-900 dark:text-white capitalize">{data.gender || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaCalendarAlt className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Date of Birth</dt>
                <dd className="text-gray-900 dark:text-white">{formatDate(data.date_of_birth)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaTint className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Blood Group</dt>
                <dd className="text-gray-900 dark:text-white font-mono">{data.blood_group || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaClock className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Registration Date</dt>
                <dd className="text-gray-900 dark:text-white">{formatDate(data.registration_date)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaCheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${data.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                    {data.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden group relative hover:shadow-md transition-all duration-200">
        <button
          onClick={() => jumpToStep(2)}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          title="Edit Emergency Contact"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <FaAmbulance className="text-red-600 dark:text-red-400 h-4 w-4" />
            </div>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Emergency Contact</h3>
          </div>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <FaUser className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Contact Name</dt>
                <dd className="text-gray-900 dark:text-white">{data.emergency_contact_name || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaPhone className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Contact Phone</dt>
                <dd className="text-gray-900 dark:text-white">{data.emergency_contact_phone || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2 md:col-span-2">
              <FaHeartbeat className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Relationship</dt>
                <dd className="text-gray-900 dark:text-white">{data.emergency_contact_relation || '-'}</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {/* Address */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden group relative hover:shadow-md transition-all duration-200">
        <button
          onClick={() => jumpToStep(3)}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          title="Edit Address"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <FaHome className="text-green-600 dark:text-green-400 h-4 w-4" />
            </div>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Address Information</h3>
          </div>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Division</dt>
                <dd className="text-gray-900 dark:text-white">{data.address_division || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaCity className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">District</dt>
                <dd className="text-gray-900 dark:text-white">{data.address_district || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaBuilding className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Police Station / Thana</dt>
                <dd className="text-gray-900 dark:text-white">{data.address_police_station || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaMailBulk className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Postal Code</dt>
                <dd className="text-gray-900 dark:text-white">{data.address_postal_code || '-'}</dd>
              </div>
            </div>
            <div className="md:col-span-2 flex items-start gap-2">
              <FaHome className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Address Details</dt>
                <dd className="text-gray-900 dark:text-white">{data.address_details || '-'}</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {/* Referral */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden group relative hover:shadow-md transition-all duration-200">
        <button
          onClick={() => jumpToStep(4)}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          title="Edit Referral Information"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <FaUserMd className="text-purple-600 dark:text-purple-400 h-4 w-4" />
            </div>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Referral Information</h3>
          </div>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <FaUserMd className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Referred By</dt>
                <dd className="text-gray-900 dark:text-white">{data.referred_by_user_id || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaGlobe className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Referral Source</dt>
                <dd className="text-gray-900 dark:text-white capitalize">{data.referral_source || '-'}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaStickyNote className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Referral Notes</dt>
                <dd className="text-gray-900 dark:text-white italic">{data.referral_notes || '-'}</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {/* Allergies */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden group relative hover:shadow-md transition-all duration-200">
        <button
          onClick={() => jumpToStep(5)}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          title="Edit Allergies"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <FaAllergies className="text-purple-600 dark:text-purple-400 h-4 w-4" />
            </div>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Allergies</h3>
            {data.allergies?.length > 0 && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                {data.allergies.length} Total
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          {data.allergies?.length === 0 ? (
            <div className="text-center py-6">
              <FaAllergies className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">No allergies recorded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.allergies?.map((allergy, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white">{allergy.allergy_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {allergy.allergy_type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(allergy.severity)}`}>
                      {allergy.severity}
                    </span>
                  </div>
                  {allergy.reaction_notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-medium">Reaction:</span> {allergy.reaction_notes}
                    </p>
                  )}
                  {allergy.diagnosed_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                      <FaCalendarAlt className="h-3 w-3" />
                      Diagnosed: {formatDate(allergy.diagnosed_date)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Medical Conditions */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden group relative hover:shadow-md transition-all duration-200">
        <button
          onClick={() => jumpToStep(6)}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          title="Edit Medical Conditions"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <FaHeartbeat className="text-red-600 dark:text-red-400 h-4 w-4" />
            </div>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Medical Conditions</h3>
            {data.conditions?.length > 0 && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {data.conditions.length} Total
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          {data.conditions?.length === 0 ? (
            <div className="text-center py-6">
              <FaHeartbeat className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">No medical conditions recorded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.conditions?.map((condition, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white">{condition.condition_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {condition.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(condition.severity)}`}>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <FaCalendarAlt className="h-3 w-3" />
                      Diagnosed: {formatDate(condition.diagnosed_date)}
                    </p>
                  )}
                  {condition.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-medium">Notes:</span> {condition.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Medications */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden group relative hover:shadow-md transition-all duration-200">
        <button
          onClick={() => jumpToStep(7)}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          title="Edit Medications"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <FaPills className="text-green-600 dark:text-green-400 h-4 w-4" />
            </div>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Medications</h3>
            {data.medications?.length > 0 && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {data.medications.length} Total
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          {data.medications?.length === 0 ? (
            <div className="text-center py-6">
              <FaPills className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">No medications recorded</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.medications?.map((medication, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white">{medication.medication_name}</span>
                    {medication.dosage && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {medication.dosage}
                      </span>
                    )}
                    {medication.frequency && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                        {medication.frequency}
                      </span>
                    )}
                  </div>
                  {(medication.start_date || medication.end_date) && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-3 flex-wrap">
                      {medication.start_date && (
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="h-3 w-3" />
                          Start: {formatDate(medication.start_date)}
                        </span>
                      )}
                      {medication.end_date && (
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="h-3 w-3" />
                          End: {formatDate(medication.end_date)}
                        </span>
                      )}
                    </p>
                  )}
                  {medication.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-start gap-1">
                      <FaNotesMedical className="h-3 w-3 mt-0.5" />
                      <span><span className="font-medium">Instructions:</span> {medication.notes}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering Patient...
            </>
          ) : (
            <>
              <FaCheckCircle className="h-4 w-4" />
              Register Patient
            </>
          )}
        </button>
      </div>
    </div>
  );
}