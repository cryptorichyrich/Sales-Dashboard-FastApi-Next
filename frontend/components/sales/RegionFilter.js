import React from 'react';

const RegionFilter = ({ regions, selectedRegion, onRegionChange, darkMode }) => {
  return (
    <div className={`relative inline-block`}>
      <select
        id="region-select"
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className={`appearance-none py-2 pl-3 pr-8 rounded-lg border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-200' 
            : 'bg-white border-gray-300 text-gray-700'
        } focus:outline-none focus:ring-2 ${
          darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-400'
        } focus:ring-opacity-50 text-sm font-medium`}
        aria-label="Filter by region"
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default RegionFilter;