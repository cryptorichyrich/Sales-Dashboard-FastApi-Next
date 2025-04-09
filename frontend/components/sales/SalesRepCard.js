import React from 'react';

const SalesRepCard = ({ rep }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {rep.name}
      </h3>
      <p className="text-gray-600 mb-4">
        {rep.role} | {rep.region}
      </p>
      
      <div className="bg-gray-100 rounded-md p-4 mb-4">
        <strong className="block mb-2 text-gray-700">Skills:</strong>
        <div className="flex flex-wrap gap-2">
          {rep.skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <strong className="block mb-2 text-gray-700">Deals:</strong>
        {rep.deals.map((deal, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-2"
          >
            <div>
              <span className="font-semibold text-gray-800">
                {deal.client}
              </span>
              <span className="text-gray-600 ml-2">
                ${deal.value.toLocaleString()}
              </span>
            </div>
            <span
              className={`text-sm font-medium ${
                deal.status === "Closed Won"
                  ? "text-green-600"
                  : deal.status === "In Progress"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {deal.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesRepCard;