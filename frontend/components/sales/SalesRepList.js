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
    <section className="mb-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-400">
          Sales Representatives
        </h2>
        <RegionFilter
          regions={regions}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />
      </div>

      {loading ? (
        <div className="w-full flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSalesReps.map((rep) => (
            <SalesRepCard key={rep.id} rep={rep} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SalesRepsList;