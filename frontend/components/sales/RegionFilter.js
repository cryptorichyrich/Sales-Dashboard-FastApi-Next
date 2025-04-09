import React from 'react';

const RegionFilter = ({ regions, selectedRegion, onRegionChange }) => {
  return (
    <div>
      <label
        htmlFor="region-select"
        className="mr-2 text-gray-600"
      >
        Filter by Region:
      </label>
      <select
        id="region-select"
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        className="p-2 border rounded"
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