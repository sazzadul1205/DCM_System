// Pages/Profile/Steps/AddressStep.jsx

import FormField from '@/Components/FormField';
import { useState, useMemo } from 'react';
import {
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaSearch,
  FaMapPin,
  FaStreetView,
  FaHome,
} from 'react-icons/fa';

// Bangladesh Divisions and Districts Data
const BANGLADESH_DATA = {
  'Dhaka': {
    districts: [
      'Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Kishoreganj',
      'Manikganj', 'Munshiganj', 'Narsingdi', 'Rajbari', 'Shariatpur',
      'Faridpur', 'Gopalganj', 'Madaripur'
    ]
  },
  'Chittagong': {
    districts: [
      'Chittagong', 'Cox\'s Bazar', 'Comilla', 'Brahmanbaria', 'Chandpur',
      'Lakshmipur', 'Noakhali', 'Feni', 'Khagrachari', 'Rangamati',
      'Bandarban'
    ]
  },
  'Khulna': {
    districts: [
      'Khulna', 'Bagerhat', 'Satkhira', 'Jessore', 'Jhenaidah',
      'Magura', 'Narail', 'Kushtia', 'Chuadanga', 'Meherpur'
    ]
  },
  'Rajshahi': {
    districts: [
      'Rajshahi', 'Chapainawabganj', 'Naogaon', 'Natore', 'Pabna',
      'Sirajganj', 'Bogra', 'Joypurhat'
    ]
  },
  'Barisal': {
    districts: [
      'Barisal', 'Barguna', 'Bhola', 'Jhalokati', 'Patuakhali',
      'Pirojpur'
    ]
  },
  'Sylhet': {
    districts: [
      'Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'
    ]
  },
  'Rangpur': {
    districts: [
      'Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Lalmonirhat',
      'Nilphamari', 'Panchagarh', 'Thakurgaon'
    ]
  },
  'Mymensingh': {
    districts: [
      'Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'
    ]
  }
};

// Police Stations (Thana) - Sample data
const POLICE_STATIONS = {
  'Dhaka': ['Dhanmondi', 'Gulshan', 'Banani', 'Motijheel', 'Paltan', 'Ramna', 'Shahbag', 'Mirpur', 'Mohammadpur', 'Uttara', 'Tejgaon', 'Khilgaon', 'Sabujbagh', 'Jatrabari', 'Kadamtali', 'Kamrangirchar', 'Lalbagh', 'Kotwali', 'Sutrapur', 'Gendaria', 'Wari', 'Ramna', 'Shahbagh'],
  'Chittagong': ['Double Mooring', 'Kotwali', 'Panchlaish', 'Chandgaon', 'Bakalia', 'EPZ', 'Pahartali', 'Halishahar', 'Bandar', 'Patenga', 'Khulshi', 'Bayezid'],
  'Khulna': ['Kotwali', 'Sonadanga', 'Daulatpur', 'Khalishpur', 'Khan Jahan Ali', 'Harintana', 'Labanchara', 'Rupsha'],
  'Rajshahi': ['Boalia', 'Rajpara', 'Shah Makhdum', 'Kashiadanga', 'Chandrima', 'Motihar'],
  'Barisal': ['Kotwali', 'Kawnia', 'Bhandaria', 'Muladi', 'Hijla', 'Mehendiganj'],
  'Sylhet': ['Kotwali', 'Jalalabad', 'South Surma', 'Mogla Bazar', 'Shah Paran'],
  'Rangpur': ['Kotwali', 'Tapodhan', 'Mithapukur', 'Badarganj', 'Pirganj'],
  'Mymensingh': ['Kotwali', 'Sadar', 'Bhaluka', 'Gouripur', 'Fulbaria']
};

export default function AddressStep({ data, setData, errors }) {
  const [searchTerm, setSearchTerm] = useState('');

  const divisions = Object.keys(BANGLADESH_DATA);

  // Use useMemo instead of useEffect for derived data
  const availableDistricts = useMemo(() => {
    if (data.address_division && BANGLADESH_DATA[data.address_division]) {
      return BANGLADESH_DATA[data.address_division].districts;
    }
    return [];
  }, [data.address_division]);

  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    if (searchTerm) {
      return availableDistricts.filter(district =>
        district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return availableDistricts;
  }, [searchTerm, availableDistricts]);

  // Get available police stations
  const availablePoliceStations = useMemo(() => {
    if (data.address_district) {
      return POLICE_STATIONS[data.address_district] ||
        POLICE_STATIONS[data.address_division] ||
        ['Central', 'Sadar', 'Model Thana'];
    }
    return [];
  }, [data.address_district, data.address_division]);

  const handleDivisionChange = (e) => {
    setData('address_division', e.target.value);
    setData('address_district', ''); // Reset district
    setData('address_police_station', ''); // Reset police station
    setSearchTerm(''); // Reset search
  };

  const handleDistrictSelect = (district) => {
    setData('address_district', district);
    setSearchTerm('');
  };

  const handlePoliceStationChange = (e) => {
    setData('address_police_station', e.target.value);
  };

  // Validate if district is valid when division changes
  const isDistrictValid = () => {
    if (!data.address_division || !data.address_district) return true;
    return availableDistricts.includes(data.address_district);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 w-full">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          Address Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Division Selection */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Division <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaGlobe className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={data.address_division}
                onChange={handleDivisionChange}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>
            {errors.address_division && <p className="text-sm text-red-600">{errors.address_division}</p>}
          </div>

          {/* District Selection with Search */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              District <span className="text-red-500">*</span>
            </label>
            {data.address_division ? (
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaCity className="h-5 w-5 text-gray-400" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm || data.address_district}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (e.target.value !== data.address_district) {
                        setData('address_district', '');
                      }
                    }}
                    placeholder="Search or select district..."
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <FaSearch className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>

                {/* Search Results Dropdown */}
                {searchTerm && !data.address_district && filteredDistricts.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {filteredDistricts.map((district) => (
                      <button
                        key={district}
                        type="button"
                        onClick={() => handleDistrictSelect(district)}
                        className="flex w-full dark:text-white items-center px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <FaMapPin className="mr-2 h-3 w-3 text-gray-400" />
                        {district}
                      </button>
                    ))}
                  </div>
                )}

                {searchTerm && !data.address_district && filteredDistricts.length === 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-500 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    No districts found
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaCity className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 pl-10 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700"
                >
                  <option>Select division first</option>
                </select>
              </div>
            )}
            {!isDistrictValid() && (
              <p className="text-sm text-red-600">Selected district is not valid for the chosen division</p>
            )}
            {errors.address_district && <p className="text-sm text-red-600">{errors.address_district}</p>}
          </div>

          {/* Police Station / Thana */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Police Station / Thana <span className="text-gray-400">(Optional)</span>
            </label>
            {data.address_district && availablePoliceStations.length > 0 ? (
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaStreetView className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={data.address_police_station}
                  onChange={handlePoliceStationChange}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Police Station</option>
                  {availablePoliceStations.map((station) => (
                    <option key={station} value={station}>{station}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaStreetView className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 pl-10 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700"
                >
                  <option>{data.address_district ? 'No police stations available' : 'Select district first'}</option>
                </select>
              </div>
            )}
          </div>

          {/* Postal Code */}
          <FormField
            id="address_postal_code"
            name="address_postal_code"
            type="text"
            label="Postal Code"
            value={data.address_postal_code}
            onChange={(e) => setData('address_postal_code', e.target.value)}
            error={errors.address_postal_code}
            icon={FaMapMarkerAlt}
            placeholder="e.g., 1207, 1212, 1000"
          />

          {/* Address Details - Textarea for detailed address */}
          <div className="col-span-2 space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address Details <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute top-3 left-3">
                <FaHome className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="address_details"
                name="address_details"
                value={data.address_details}
                onChange={(e) => setData('address_details', e.target.value)}
                rows="4"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="House No: 123, Road: 45, Block: C, Area: Banani, Near: City Center Mall"
                required
              />
            </div>
            {errors.address_details && <p className="text-sm text-red-600">{errors.address_details}</p>}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Include house number, road name, area, landmark, and any other relevant details
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FaMapMarkerAlt className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-300">Address Tips:</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Include apartment/suite number if applicable</li>
                <li>Mention nearby landmarks for easier location</li>
                <li>Double-check postal code for accurate delivery</li>
                <li>This address will be used for emergency services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}