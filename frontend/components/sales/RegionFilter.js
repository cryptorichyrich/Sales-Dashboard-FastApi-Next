import React from 'react';

const RegionFilter = ({ regions, selectedRegion, onRegionChange, darkMode }) => {
  return (
    <div className="flex items-center">
      <label
        htmlFor="region-select"
        className={`mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
      >
        Filter by Region:
      </label>
      <select
        id="region-select"
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className={`p-2 border rounded ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-800'
        }`}
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionFilter;