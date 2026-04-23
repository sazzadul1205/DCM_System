// Pages/Profile/Steps/EmergencyStep.jsx

import FormField from '@/Components/FormField';
import {
  FaUser,
  FaPhoneAlt,
  FaHeartbeat,
  FaExclamationTriangle,
  FaShieldAlt
} from 'react-icons/fa';

export default function EmergencyStep({ data, setData, errors }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaHeartbeat className="text-red-600" />
          Emergency Contact Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            id="emergency_contact_name"
            name="emergency_contact_name"
            type="text"
            label="Emergency Contact Name"
            value={data.emergency_contact_name}
            onChange={(e) => setData('emergency_contact_name', e.target.value)}
            error={errors.emergency_contact_name}
            icon={FaUser}
            placeholder="Full name of emergency contact"
          />

          <FormField
            id="emergency_contact_phone"
            name="emergency_contact_phone"
            type="tel"
            label="Emergency Contact Phone"
            value={data.emergency_contact_phone}
            onChange={(e) => setData('emergency_contact_phone', e.target.value)}
            error={errors.emergency_contact_phone}
            icon={FaPhoneAlt}
            placeholder="+880 1XXX-XXXXXX"
          />

          <FormField
            id="emergency_contact_relation"
            name="emergency_contact_relation"
            type="text"
            label="Relationship"
            value={data.emergency_contact_relation}
            onChange={(e) => setData('emergency_contact_relation', e.target.value)}
            error={errors.emergency_contact_relation}
            icon={FaUser}
            placeholder="e.g., Father, Mother, Spouse"
          />
        </div>

        {/* Safety Tips */}
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">Why is this important?</h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                Your emergency contact information helps us reach your loved ones quickly during critical situations.
                Please ensure this information is accurate and up-to-date.
              </p>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-6 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 p-4 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <FaShieldAlt className="h-4 w-4 text-green-600" />
            <span>✓ Your information is secure and will only be used for emergency purposes</span>
          </div>
        </div>
      </div>
    </div>
  );
}