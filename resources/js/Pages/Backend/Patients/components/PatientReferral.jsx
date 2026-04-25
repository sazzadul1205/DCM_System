// Pages/Backend/Patients/components/PatientReferral.jsx

import FormField from '@/Components/FormField';
import { FaUserMd, FaGlobe, FaStickyNote } from 'react-icons/fa';

const referralSourceOptions = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'patient', label: 'Patient' },
  { value: 'walk_in', label: 'Walk In' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'news', label: 'News' },
  { value: 'other', label: 'Other' },
];

export default function PatientReferral({ data, setData, errors, referrers }) {
  const referrerOptions = referrers?.map(ref => ({
    value: ref.id,
    label: `${ref.name} (${ref.email})`
  })) || [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaUserMd className="text-blue-600" />
          Referral Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Referred By (Doctor/Staff) */}
          <FormField
            id="referred_by_user_id"
            name="referred_by_user_id"
            type="select"
            label="Referred By (Doctor/Staff)"
            value={data.referred_by_user_id}
            onChange={(e) => setData('referred_by_user_id', e.target.value)}
            error={errors.referred_by_user_id}
            icon={FaUserMd}
            options={referrerOptions}
            placeholder="Select referrer"
          />

          {/* Referral Source - NOW A SELECT DROPDOWN matching ENUM */}
          <FormField
            id="referral_source"
            name="referral_source"
            type="select"
            label="Referral Source"
            value={data.referral_source}
            onChange={(e) => setData('referral_source', e.target.value)}
            error={errors.referral_source}
            icon={FaGlobe}
            options={referralSourceOptions}
            placeholder="Select referral source"
          />

          {/* Referral Notes - Full width (this can still be free text) */}
          <div className="md:col-span-2">
            <FormField
              id="referral_notes"
              name="referral_notes"
              type="textarea"
              label="Referral Notes"
              value={data.referral_notes}
              onChange={(e) => setData('referral_notes', e.target.value)}
              error={errors.referral_notes}
              icon={FaStickyNote}
              placeholder="Additional notes about the referral..."
              rows={3}
              maxLength={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}