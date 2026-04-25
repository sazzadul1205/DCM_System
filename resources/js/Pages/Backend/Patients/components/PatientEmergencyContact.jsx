// Pages/Backend/Patients/components/PatientEmergencyContact.jsx

import FormField from '@/Components/FormField';
import { FaUser, FaPhone, FaHeartbeat } from 'react-icons/fa';

export default function PatientEmergencyContact({ data, setData, errors }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaHeartbeat className="text-red-500" />
          Emergency Contact
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Emergency Contact Name */}
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

          {/* Emergency Contact Phone */}
          <FormField
            id="emergency_contact_phone"
            name="emergency_contact_phone"
            type="tel"
            label="Emergency Contact Phone"
            value={data.emergency_contact_phone}
            onChange={(e) => setData('emergency_contact_phone', e.target.value)}
            error={errors.emergency_contact_phone}
            icon={FaPhone}
            placeholder="+880 1XXX-XXXXXX"
          />

          {/* Relationship */}
          <FormField
            id="emergency_contact_relation"
            name="emergency_contact_relation"
            type="text"
            label="Relationship"
            value={data.emergency_contact_relation}
            onChange={(e) => setData('emergency_contact_relation', e.target.value)}
            error={errors.emergency_contact_relation}
            icon={FaHeartbeat}
            placeholder="e.g., Spouse, Parent, Sibling"
          />
        </div>
      </div>
    </div>
  );
}