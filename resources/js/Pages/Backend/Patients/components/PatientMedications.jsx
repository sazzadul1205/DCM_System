// Pages/Backend/Patients/components/PatientMedications.jsx

import { useState } from 'react';
import FormField from '@/Components/FormField';
import Swal from 'sweetalert2';
import {
  FaPlus,
  FaTrash,
  FaPills,
  FaCalendarAlt,
  FaStethoscope,
  FaNotesMedical,
  FaPrescription,
  FaClock,
} from 'react-icons/fa';

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

  const showErrorToast = (message) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const addMedication = () => {
    if (!newMed.medication_name) {
      showErrorToast('Medication name is required');
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
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <FaPills className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Medications</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {medications.length} recorded medication{medications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Add Medication Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FaPrescription className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Add a new medication</p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  id="medication_name"
                  name="medication_name"
                  type="text"
                  label="Medication Name"
                  value={newMed.medication_name}
                  onChange={(e) => updateNewMed('medication_name', e.target.value)}
                  icon={FaPills}
                  placeholder="e.g., Paracetamol, Amoxicillin"
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
                  placeholder="e.g., 500mg, 10ml"
                />

                <FormField
                  id="frequency"
                  name="frequency"
                  type="text"
                  label="Frequency"
                  value={newMed.frequency}
                  onChange={(e) => updateNewMed('frequency', e.target.value)}
                  icon={FaClock}
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
                placeholder="e.g., Take with food, Avoid alcohol, Complete the full course"
                rows={2}
              />

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={addMedication}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  <FaPlus className="h-3.5 w-3.5" />
                  Add Medication
                </button>
              </div>
            </div>
          </div>

          {/* Medications List */}
          {medications.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FaPills className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                    Current Medications
                  </h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  {medications.length} Total
                </span>
              </div>

              <div className="grid gap-3">
                {medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{med.medication_name}</h4>
                          {med.dosage && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                              <FaPills className="h-2.5 w-2.5 inline mr-1" />
                              {med.dosage}
                            </span>
                          )}
                          {med.frequency && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 font-medium">
                              <FaClock className="h-2.5 w-2.5 inline mr-1" />
                              {med.frequency}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                          {(med.start_date || med.end_date) && (
                            <div className="flex items-center gap-3 flex-wrap">
                              {med.start_date && (
                                <div className="flex items-center gap-2">
                                  <FaCalendarAlt className="h-3 w-3 text-gray-400" />
                                  <span>Start: <span className="font-medium">{med.start_date}</span></span>
                                </div>
                              )}
                              {med.end_date && (
                                <div className="flex items-center gap-2">
                                  <FaCalendarAlt className="h-3 w-3 text-gray-400" />
                                  <span>End: <span className="font-medium">{med.end_date}</span></span>
                                </div>
                              )}
                            </div>
                          )}
                          {med.notes && (
                            <div className="flex items-start gap-2">
                              <FaNotesMedical className="h-3 w-3 text-gray-400 mt-0.5" />
                              <span className="italic text-xs">{med.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeMedication(idx)}
                        className="text-gray-400 hover:text-red-500 transition-all p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Remove medication"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {medications.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <FaPills className="h-10 w-10 text-green-400 dark:text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Medications Added</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add medications prescribed to the patient above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}