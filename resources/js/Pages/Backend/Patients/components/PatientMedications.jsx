// Pages/Backend/Patients/components/PatientMedications.jsx

import { useState } from 'react';
import FormField from '@/Components/FormField';
import { FaPlus, FaTrash, FaPills, FaCalendarAlt, FaStethoscope, FaNotesMedical } from 'react-icons/fa';

export default function PatientMedications({ data, setData }) {
  const [newMed, setNewMed] = useState({
    medication_name: '',
    dosage: '',
    frequency: '',
    start_date: '',
    end_date: '',
    notes: '',
  });

  const medications = data.medications || [];

  const addMedication = () => {
    if (!newMed.medication_name) {
      alert('Medication name is required');
      return;
    }

    setData('medications', [...medications, { ...newMed, is_active: true }]);
    setNewMed({
      medication_name: '',
      dosage: '',
      frequency: '',
      start_date: '',
      end_date: '',
      notes: '',
    });
  };

  const removeMedication = (index) => {
    const newList = [...medications];
    newList.splice(index, 1);
    setData('medications', newList);
  };

  const updateNewMed = (field, value) => {
    setNewMed(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaPills className="text-green-600" />
          Medications
        </h2>

        {/* Add Medication Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <FaPlus className="h-4 w-4" />
            Add a new medication
          </p>

          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FormField
                id="medication_name"
                name="medication_name"
                type="text"
                label="Medication Name"
                value={newMed.medication_name}
                onChange={(e) => updateNewMed('medication_name', e.target.value)}
                icon={FaPills}
                placeholder="e.g., Paracetamol"
                required
              />

              <FormField
                id="dosage"
                name="dosage"
                type="text"
                label="Dosage"
                value={newMed.dosage}
                onChange={(e) => updateNewMed('dosage', e.target.value)}
                icon={FaStethoscope}
                placeholder="e.g., 500mg"
              />

              <FormField
                id="frequency"
                name="frequency"
                type="text"
                label="Frequency"
                value={newMed.frequency}
                onChange={(e) => updateNewMed('frequency', e.target.value)}
                icon={FaCalendarAlt}
                placeholder="e.g., Twice daily, Every 8 hours"
              />

              <FormField
                id="start_date"
                name="start_date"
                type="date"
                label="Start Date"
                value={newMed.start_date}
                onChange={(e) => updateNewMed('start_date', e.target.value)}
                icon={FaCalendarAlt}
              />

              <FormField
                id="end_date"
                name="end_date"
                type="date"
                label="End Date"
                value={newMed.end_date}
                onChange={(e) => updateNewMed('end_date', e.target.value)}
                icon={FaCalendarAlt}
              />
            </div>

            <FormField
              id="notes"
              name="notes"
              type="textarea"
              label="Notes / Instructions"
              value={newMed.notes}
              onChange={(e) => updateNewMed('notes', e.target.value)}
              icon={FaNotesMedical}
              placeholder="e.g., Take with food, Avoid alcohol, etc."
              rows={2}
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={addMedication}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700"
              >
                <FaPlus className="h-3 w-3" />
                Add Medication
              </button>
            </div>
          </div>
        </div>

        {/* Medications List */}
        {medications.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaPills className="h-4 w-4 text-green-600" />
              Current Medications ({medications.length})
            </h3>

            <div className="space-y-2">
              {medications.map((med, idx) => (
                <div key={idx} className="flex justify-between items-start bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-gray-900 dark:text-white">{med.medication_name}</p>
                      {med.dosage && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {med.dosage}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {med.frequency && <p>Frequency: <span className="font-medium">{med.frequency}</span></p>}
                      {(med.start_date || med.end_date) && (
                        <p>
                          {med.start_date && <>Start: <span className="font-medium">{med.start_date}</span></>}
                          {med.start_date && med.end_date && <> | </>}
                          {med.end_date && <>End: <span className="font-medium">{med.end_date}</span></>}
                        </p>
                      )}
                      {med.notes && <p className="text-xs">Note: {med.notes}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMedication(idx)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {medications.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FaPills className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No medications added yet</p>
            <p className="text-sm">Add medications prescribed to the patient above</p>
          </div>
        )}
      </div>
    </div>
  );
}