// Pages/Backend/Patients/components/PatientAllergies.jsx

import { useState } from 'react';
import FormField from '@/Components/FormField';
import Swal from 'sweetalert2';
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaAllergies,
  FaCalendarAlt,
  FaNotesMedical,
  FaInfoCircle,
  FaTag,
  FaExclamationTriangle
} from 'react-icons/fa';

const severityOptions = [
  { value: 'Mild', label: 'Mild', color: 'green' },
  { value: 'Moderate', label: 'Moderate', color: 'yellow' },
  { value: 'Severe', label: 'Severe', color: 'red' },
];

export default function PatientAllergies({ data, setData, availableAllergies }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const [tempAllergy, setTempAllergy] = useState({
    allergy_id: '',
    severity: 'Mild',
    reaction_notes: '',
    diagnosed_date: '',
  });

  const allergies = data.allergies || [];

  const filteredAllergies = availableAllergies?.filter(a =>
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const showWarningToast = (message) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const addAllergy = () => {
    if (!tempAllergy.allergy_id) return;

    const exists = allergies.some(a => a.allergy_id === tempAllergy.allergy_id);
    if (exists) {
      showWarningToast('Allergy already added');
      return;
    }

    const allergyObj = availableAllergies?.find(a => a.id === parseInt(tempAllergy.allergy_id));
    setData('allergies', [...allergies, {
      ...tempAllergy,
      allergy_id: parseInt(tempAllergy.allergy_id),
      allergy_name: allergyObj?.name,
      allergy_type: allergyObj?.type,
    }]);

    setTempAllergy({ allergy_id: '', severity: 'Mild', reaction_notes: '', diagnosed_date: '' });
    setSearchTerm('');
    setSelectedAllergy(null);
  };

  const removeAllergy = (index) => {
    const newList = [...allergies];
    newList.splice(index, 1);
    setData('allergies', newList);
  };

  const updateTempField = (field, value) => {
    setTempAllergy(prev => ({ ...prev, [field]: value }));
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
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <FaAllergies className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Allergies</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {allergies.length} recorded allergy{allergies.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Search Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FaSearch className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Search and add allergy</p>
            </div>

            <div className="relative">
              <FormField
                id="allergy_search"
                name="allergy_search"
                type="text"
                label="Search Allergy"
                hideLabel={false}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={FaSearch}
                placeholder="Search allergy by name or type..."
                className="mb-2"
              />

              {searchTerm && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-auto">
                  {filteredAllergies.map(allergy => (
                    <div
                      key={allergy.id}
                      className="p-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-150 border-b border-gray-100 dark:border-gray-700 last:border-0 group"
                      onClick={() => {
                        setSelectedAllergy(allergy);
                        setTempAllergy(prev => ({ ...prev, allergy_id: allergy.id }));
                        setSearchTerm('');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                            {allergy.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              {allergy.type}
                            </span>
                          </div>
                        </div>
                        <FaPlus className="h-3 w-3 text-gray-400 group-hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </div>
                  ))}
                  {filteredAllergies.length === 0 && (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      <FaInfoCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No allergies found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedAllergy && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FaTag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Adding: {selectedAllergy.name}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    id="temp_severity"
                    name="temp_severity"
                    type="select"
                    label="Severity"
                    value={tempAllergy.severity}
                    onChange={(e) => updateTempField('severity', e.target.value)}
                    options={severityOptions}
                    icon={FaExclamationTriangle}
                  />

                  <FormField
                    id="temp_diagnosed_date"
                    name="temp_diagnosed_date"
                    type="date"
                    label="Diagnosed Date"
                    value={tempAllergy.diagnosed_date}
                    onChange={(e) => updateTempField('diagnosed_date', e.target.value)}
                    icon={FaCalendarAlt}
                  />

                  <FormField
                    id="temp_reaction_notes"
                    name="temp_reaction_notes"
                    type="text"
                    label="Reaction Notes"
                    value={tempAllergy.reaction_notes}
                    onChange={(e) => updateTempField('reaction_notes', e.target.value)}
                    icon={FaNotesMedical}
                    placeholder="e.g., hives, swelling"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={addAllergy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    <FaPlus className="h-3.5 w-3.5" />
                    Add Allergy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Added Allergies List */}
          {allergies.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FaAllergies className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                    Added Allergies
                  </h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {allergies.length} Total
                </span>
              </div>

              <div className="grid gap-3">
                {allergies.map((allergy, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{allergy.allergy_name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {allergy.allergy_type}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityColor(allergy.severity)}`}>
                            {allergy.severity}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                          {allergy.diagnosed_date && (
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="h-3 w-3 text-gray-400" />
                              <span>Diagnosed: {allergy.diagnosed_date}</span>
                            </div>
                          )}
                          {allergy.reaction_notes && (
                            <div className="flex items-start gap-2">
                              <FaNotesMedical className="h-3 w-3 text-gray-400 mt-0.5" />
                              <span>Reaction: {allergy.reaction_notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeAllergy(idx)}
                        className="text-gray-400 hover:text-red-500 transition-all p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Remove allergy"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-purple-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {allergies.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                <FaAllergies className="h-10 w-10 text-purple-400 dark:text-purple-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Allergies Added</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Search and add allergies above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}