// Pages/Backend/Patients/components/PatientAllergies.jsx

import { useState } from 'react';
import FormField from '@/Components/FormField';
import { FaSearch, FaPlus, FaTrash, FaAllergies, FaStethoscope } from 'react-icons/fa';

const severityOptions = [
  { value: 'Mild', label: 'Mild' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Severe', label: 'Severe' },
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

  const addAllergy = () => {
    if (!tempAllergy.allergy_id) return;

    const exists = allergies.some(a => a.allergy_id === tempAllergy.allergy_id);
    if (exists) {
      alert('Allergy already added');
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

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaAllergies className="text-purple-600" />
          Allergies
        </h2>

        {/* Search Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <FaSearch className="h-4 w-4" />
            Search and add allergy
          </p>

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
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredAllergies.map(allergy => (
                  <div
                    key={allergy.id}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                    onClick={() => {
                      setSelectedAllergy(allergy);
                      setTempAllergy(prev => ({ ...prev, allergy_id: allergy.id }));
                      setSearchTerm('');
                    }}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{allergy.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{allergy.type}</div>
                  </div>
                ))}
                {filteredAllergies.length === 0 && (
                  <div className="p-3 text-gray-500 dark:text-gray-400 text-center">No allergies found</div>
                )}
              </div>
            )}
          </div>

          {selectedAllergy && (
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <FormField
                  id="temp_severity"
                  name="temp_severity"
                  type="select"
                  label="Severity"
                  value={tempAllergy.severity}
                  onChange={(e) => updateTempField('severity', e.target.value)}
                  options={severityOptions}
                  icon={FaStethoscope}
                />

                <FormField
                  id="temp_diagnosed_date"
                  name="temp_diagnosed_date"
                  type="date"
                  label="Diagnosed Date"
                  value={tempAllergy.diagnosed_date}
                  onChange={(e) => updateTempField('diagnosed_date', e.target.value)}
                />

                <FormField
                  id="temp_reaction_notes"
                  name="temp_reaction_notes"
                  type="text"
                  label="Reaction Notes"
                  value={tempAllergy.reaction_notes}
                  onChange={(e) => updateTempField('reaction_notes', e.target.value)}
                  placeholder="e.g., hives, swelling"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addAllergy}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700"
                >
                  <FaPlus className="h-3 w-3" />
                  Add Allergy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Added Allergies List */}
        {allergies.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaAllergies className="h-4 w-4 text-purple-600" />
              Added Allergies ({allergies.length})
            </h3>

            <div className="space-y-2">
              {allergies.map((allergy, idx) => (
                <div key={idx} className="flex justify-between items-start bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">{allergy.allergy_name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        {allergy.allergy_type}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>Severity: <span className="font-medium">{allergy.severity}</span></p>
                      {allergy.diagnosed_date && <p>Diagnosed: {allergy.diagnosed_date}</p>}
                      {allergy.reaction_notes && <p>Reaction: {allergy.reaction_notes}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAllergy(idx)}
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
        {allergies.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FaAllergies className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No allergies added yet</p>
            <p className="text-sm">Search and add allergies above</p>
          </div>
        )}
      </div>
    </div>
  );
}