import React from 'react';

const RegionFilter = ({ regions, selectedRegion, onRegionChange }) => {
  return (
    <div>
      <label
        htmlFor="region-select"
        className="mr-2 text-gray-300"
      >
        Filter by Region:
      </label>
      <select
        id="region-select"
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
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