// Pages/Backend/Patients/components/PatientConditions.jsx

import { useState } from 'react';
import FormField from '@/Components/FormField';
import { FaSearch, FaPlus, FaTrash, FaHeartbeat, FaStethoscope, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const severityOptions = [
  { value: 'Mild', label: 'Mild' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Severe', label: 'Severe' },
];

export default function PatientConditions({ data, setData, availableConditions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [tempCondition, setTempCondition] = useState({
    condition_id: '',
    severity: 'Mild',
    diagnosed_date: '',
    notes: '',
    is_active: true,
  });

  const conditions = data.conditions || [];

  const filteredConditions = availableConditions?.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const addCondition = () => {
    if (!tempCondition.condition_id) return;

    const exists = conditions.some(c => c.condition_id === tempCondition.condition_id);
    if (exists) {
      alert('Condition already added');
      return;
    }

    const conditionObj = availableConditions?.find(c => c.id === parseInt(tempCondition.condition_id));
    setData('conditions', [...conditions, {
      ...tempCondition,
      condition_id: parseInt(tempCondition.condition_id),
      condition_name: conditionObj?.name,
      category: conditionObj?.category,
    }]);

    setTempCondition({
      condition_id: '',
      severity: 'Mild',
      diagnosed_date: '',
      notes: '',
      is_active: true,
    });
    setSearchTerm('');
    setSelectedCondition(null);
  };

  const removeCondition = (index) => {
    const newList = [...conditions];
    newList.splice(index, 1);
    setData('conditions', newList);
  };

  const updateTempField = (field, value) => {
    setTempCondition(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaHeartbeat className="text-red-600" />
          Medical Conditions
        </h2>

        {/* Search Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <FaSearch className="h-4 w-4" />
            Search and add medical condition
          </p>

          <div className="relative">
            <FormField
              id="condition_search"
              name="condition_search"
              type="text"
              label="Search Condition"
              hideLabel={false}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={FaSearch}
              placeholder="Search condition by name or category..."
              className="mb-2"
            />

            {searchTerm && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredConditions.map(condition => (
                  <div
                    key={condition.id}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                    onClick={() => {
                      setSelectedCondition(condition);
                      setTempCondition(prev => ({ ...prev, condition_id: condition.id }));
                      setSearchTerm('');
                    }}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{condition.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{condition.category}</div>
                  </div>
                ))}
                {filteredConditions.length === 0 && (
                  <div className="p-3 text-gray-500 dark:text-gray-400 text-center">No conditions found</div>
                )}
              </div>
            )}
          </div>

          {selectedCondition && (
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <FormField
                  id="temp_severity"
                  name="temp_severity"
                  type="select"
                  label="Severity"
                  value={tempCondition.severity}
                  onChange={(e) => updateTempField('severity', e.target.value)}
                  options={severityOptions}
                  icon={FaStethoscope}
                />

                <FormField
                  id="temp_diagnosed_date"
                  name="temp_diagnosed_date"
                  type="date"
                  label="Diagnosed Date"
                  value={tempCondition.diagnosed_date}
                  onChange={(e) => updateTempField('diagnosed_date', e.target.value)}
                  icon={FaCalendarAlt}
                />

                <FormField
                  id="temp_notes"
                  name="temp_notes"
                  type="text"
                  label="Notes"
                  value={tempCondition.notes}
                  onChange={(e) => updateTempField('notes', e.target.value)}
                  placeholder="Additional notes"
                />

                <div className="flex items-end">
                  <div className="w-full">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Status
                    </label>
                    <button
                      type="button"
                      onClick={() => updateTempField('is_active', !tempCondition.is_active)}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 ${tempCondition.is_active
                          ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                    >
                      <FaCheckCircle className={`h-4 w-4 ${tempCondition.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                      {tempCondition.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addCondition}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-purple-700"
                >
                  <FaPlus className="h-3 w-3" />
                  Add Condition
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Added Conditions List */}
        {conditions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaHeartbeat className="h-4 w-4 text-red-600" />
              Added Conditions ({conditions.length})
            </h3>

            <div className="space-y-2">
              {conditions.map((condition, idx) => (
                <div key={idx} className="flex justify-between items-start bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-gray-900 dark:text-white">{condition.condition_name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        {condition.category}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${condition.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                        {condition.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>Severity: <span className="font-medium">{condition.severity}</span></p>
                      {condition.diagnosed_date && <p>Diagnosed: {condition.diagnosed_date}</p>}
                      {condition.notes && <p>Notes: {condition.notes}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCondition(idx)}
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
        {conditions.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FaHeartbeat className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No medical conditions added yet</p>
            <p className="text-sm">Search and add conditions above</p>
          </div>
        )}
      </div>
    </div>
  );
}