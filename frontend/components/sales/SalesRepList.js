import React from 'react';
import SalesRepCard from './SalesRepCard';
import RegionFilter from './RegionFilter';

const SalesRepsList = ({ salesReps, loading, selectedRegion, setSelectedRegion }) => {
  // Get unique regions
  const regions = [...new Set(salesReps.map((rep) => rep.region))];

  // Filter sales reps by region
  const filteredSalesReps = selectedRegion
    ? salesReps.filter((rep) => rep.region === selectedRegion)
    : salesReps;

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Sales Representatives
        </h2>
        <RegionFilter
          regions={regions}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading sales representatives...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSalesReps.map((rep) => (
            <SalesRepCard key={rep.id} rep={rep} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SalesRepsList;