// Pages/Backend/Patients/components/PatientConditions.jsx

import { useState } from 'react';
import FormField from '@/Components/FormField';
import Swal from 'sweetalert2';
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaHeartbeat,
  FaCalendarAlt,
  FaCheckCircle,
  FaTag,
  FaInfoCircle,
  FaNotesMedical,
  FaExclamationTriangle
} from 'react-icons/fa';

const severityOptions = [
  { value: 'Mild', label: 'Mild', color: 'green' },
  { value: 'Moderate', label: 'Moderate', color: 'yellow' },
  { value: 'Severe', label: 'Severe', color: 'red' },
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

  const addCondition = () => {
    if (!tempCondition.condition_id) return;

    const exists = conditions.some(c => c.condition_id === tempCondition.condition_id);
    if (exists) {
      showWarningToast('Condition already added');
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
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <FaHeartbeat className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Conditions</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {conditions.length} recorded condition{conditions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Search Section */}
          <div className="mb-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FaSearch className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Search and add medical condition</p>
            </div>

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
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-auto">
                  {filteredConditions.map(condition => (
                    <div
                      key={condition.id}
                      className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-150 border-b border-gray-100 dark:border-gray-700 last:border-0 group"
                      onClick={() => {
                        setSelectedCondition(condition);
                        setTempCondition(prev => ({ ...prev, condition_id: condition.id }));
                        setSearchTerm('');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                            {condition.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              {condition.category}
                            </span>
                          </div>
                        </div>
                        <FaPlus className="h-3 w-3 text-gray-400 group-hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </div>
                  ))}
                  {filteredConditions.length === 0 && (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      <FaInfoCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No conditions found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedCondition && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <FaTag className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    Adding: {selectedCondition.name}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <FormField
                    id="temp_severity"
                    name="temp_severity"
                    type="select"
                    label="Severity"
                    value={tempCondition.severity}
                    onChange={(e) => updateTempField('severity', e.target.value)}
                    options={severityOptions}
                    icon={FaExclamationTriangle}
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
                    icon={FaNotesMedical}
                    placeholder="e.g., Requires monitoring, Under treatment"
                  />

                  <div className="flex items-end">
                    <div className="w-full">
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Active Status
                      </label>
                      <button
                        type="button"
                        onClick={() => updateTempField('is_active', !tempCondition.is_active)}
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${tempCondition.is_active
                          ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:text-green-400 shadow-sm'
                          : 'bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                      >
                        <FaCheckCircle className={`h-4 w-4 ${tempCondition.is_active ? 'text-green-500' : 'text-gray-400'}`} />
                        {tempCondition.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={addCondition}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                  >
                    <FaPlus className="h-3.5 w-3.5" />
                    Add Condition
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Added Conditions List */}
          {conditions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <FaHeartbeat className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                    Added Conditions
                  </h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  {conditions.length} Total
                </span>
              </div>

              <div className="grid gap-3">
                {conditions.map((condition, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{condition.condition_name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {condition.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSeverityColor(condition.severity)}`}>
                            {condition.severity}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${condition.is_active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                            {condition.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                          {condition.diagnosed_date && (
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="h-3 w-3 text-gray-400" />
                              <span>Diagnosed: {condition.diagnosed_date}</span>
                            </div>
                          )}
                          {condition.notes && (
                            <div className="flex items-start gap-2">
                              <FaNotesMedical className="h-3 w-3 text-gray-400 mt-0.5" />
                              <span className="italic">{condition.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeCondition(idx)}
                        className="text-gray-400 hover:text-red-500 transition-all p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Remove condition"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {conditions.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <FaHeartbeat className="h-10 w-10 text-red-400 dark:text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Conditions Added</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Search and add medical conditions above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}