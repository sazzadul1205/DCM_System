// Pages/Backend/Patients/components/PatientReview.jsx

import { FaEdit, FaUser, FaAmbulance, FaHome, FaUserMd, FaAllergies, FaHeartbeat, FaPills } from 'react-icons/fa';

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

  // Get referrer name from ID (you can pass referrers prop if needed)
  const getReferrerName = (id) => {
    if (!id) return '-';
    // This would need referrers prop passed to show actual name
    return id;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Review Patient Information</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please verify all details. Click the edit icon next to each section to make changes.
        </p>
      </div>

      {/* Basic Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 relative group">
        <button
          onClick={() => jumpToStep(1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
          title="Edit Basic Information"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <FaUser className="text-blue-600 h-5 w-5" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Full Name</dt>
            <dd className="text-gray-900 dark:text-white">{data.name || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Email Address</dt>
            <dd className="text-gray-900 dark:text-white">{data.email || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Primary Phone</dt>
            <dd className="text-gray-900 dark:text-white">{data.phone_primary || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Secondary Phone</dt>
            <dd className="text-gray-900 dark:text-white">{data.phone_secondary || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Gender</dt>
            <dd className="text-gray-900 dark:text-white capitalize">{data.gender || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Date of Birth</dt>
            <dd className="text-gray-900 dark:text-white">{formatDate(data.date_of_birth)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Blood Group</dt>
            <dd className="text-gray-900 dark:text-white">{data.blood_group || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Registration Date</dt>
            <dd className="text-gray-900 dark:text-white">{formatDate(data.registration_date)}</dd>
          </div>
          <div className="space-y-1">
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
        </dl>
      </div>

      {/* Emergency Contact */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 relative group">
        <button
          onClick={() => jumpToStep(2)}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
          title="Edit Emergency Contact"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <FaAmbulance className="text-red-600 h-5 w-5" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Emergency Contact</h3>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Contact Name</dt>
            <dd className="text-gray-900 dark:text-white">{data.emergency_contact_name || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Contact Phone</dt>
            <dd className="text-gray-900 dark:text-white">{data.emergency_contact_phone || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Relationship</dt>
            <dd className="text-gray-900 dark:text-white">{data.emergency_contact_relation || '-'}</dd>
          </div>
        </dl>
      </div>

      {/* Address */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 relative group">
        <button
          onClick={() => jumpToStep(3)}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
          title="Edit Address"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <FaHome className="text-green-600 h-5 w-5" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address Information</h3>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Division</dt>
            <dd className="text-gray-900 dark:text-white">{data.address_division || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">District</dt>
            <dd className="text-gray-900 dark:text-white">{data.address_district || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Police Station / Thana</dt>
            <dd className="text-gray-900 dark:text-white">{data.address_police_station || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Postal Code</dt>
            <dd className="text-gray-900 dark:text-white">{data.address_postal_code || '-'}</dd>
          </div>
          <div className="md:col-span-2 space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Address Details</dt>
            <dd className="text-gray-900 dark:text-white">{data.address_details || '-'}</dd>
          </div>
        </dl>
      </div>

      {/* Referral */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 relative group">
        <button
          onClick={() => jumpToStep(4)}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
          title="Edit Referral Information"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <FaUserMd className="text-purple-600 h-5 w-5" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Referral Information</h3>
        </div>
        <dl className="grid grid-cols-1 gap-4 text-sm">
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Referred By</dt>
            <dd className="text-gray-900 dark:text-white">{getReferrerName(data.referred_by_user_id)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Referral Source</dt>
            <dd className="text-gray-900 dark:text-white">{data.referral_source || '-'}</dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Referral Notes</dt>
            <dd className="text-gray-900 dark:text-white">{data.referral_notes || '-'}</dd>
          </div>
        </dl>
      </div>

      {/* Allergies */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 relative group">
        <button
          onClick={() => jumpToStep(5)}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
          title="Edit Allergies"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <FaAllergies className="text-purple-600 h-5 w-5" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Allergies</h3>
        </div>
        {data.allergies?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No allergies recorded</p>
        ) : (
          <div className="space-y-2">
            {data.allergies?.map((allergy, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{allergy.allergy_name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${allergy.severity === 'Severe' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      allergy.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                    {allergy.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Type: {allergy.allergy_type}
                </p>
                {allergy.reaction_notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Reaction: {allergy.reaction_notes}
                  </p>
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

      {/* Medical Conditions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 relative group">
        <button
          onClick={() => jumpToStep(6)}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
          title="Edit Medical Conditions"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <FaHeartbeat className="text-red-600 h-5 w-5" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Conditions</h3>
        </div>
        {data.conditions?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No medical conditions recorded</p>
        ) : (
          <div className="space-y-2">
            {data.conditions?.map((condition, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-gray-900 dark:text-white">{condition.condition_name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {condition.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${condition.severity === 'Severe' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      condition.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
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

      {/* Medications */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 relative group">
        <button
          onClick={() => jumpToStep(7)}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
          title="Edit Medications"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <FaPills className="text-green-600 h-5 w-5" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medications</h3>
        </div>
        {data.medications?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No medications recorded</p>
        ) : (
          <div className="space-y-2">
            {data.medications?.map((medication, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-gray-900 dark:text-white">{medication.medication_name}</span>
                  {medication.dosage && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {medication.dosage}
                    </span>
                  )}
                </div>
                {medication.frequency && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Frequency: {medication.frequency}
                  </p>
                )}
                {(medication.start_date || medication.end_date) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {medication.start_date && <>Start: {formatDate(medication.start_date)}</>}
                    {medication.start_date && medication.end_date && <> | </>}
                    {medication.end_date && <>End: {formatDate(medication.end_date)}</>}
                  </p>
                )}
                {medication.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Instructions: {medication.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pb-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-green-700 hover:to-green-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering Patient...
            </>
          ) : (
            <>
              <FaPills className="h-4 w-4" />
              Register Patient
            </>
          )}
        </button>
      </div>
    </div>
  );
}