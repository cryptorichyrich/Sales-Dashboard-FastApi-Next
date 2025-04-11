import React from 'react';

const SalesRepCard = ({ rep, darkMode }) => {
  return (
    <div className={`h-full rounded-lg shadow-md p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-xl font-bold mb-2 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {rep.name}
      </h3>
      <p className={`mb-4 ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {rep.role} | {rep.region}
      </p>
      
      <div className={`rounded-md p-4 mb-4 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <strong className={`block mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Skills:</strong>
        <div className="flex flex-wrap gap-2">
          {rep.skills.map((skill) => (
            <span
              key={skill}
              className={`text-xs px-2 py-1 rounded-full ${
                darkMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <strong className={`block mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Deals:</strong>
        {rep.deals.map((deal, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-3 rounded-md mb-2 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div>
              <span className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {deal.client}
              </span>
              <span className={`ml-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                ${deal.value.toLocaleString()}
              </span>
            </div>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                deal.status === "Closed Won"
                  ? darkMode ? "text-green-300 bg-green-900/30" : "text-green-800 bg-green-100"
                  : deal.status === "In Progress"
                  ? darkMode ? "text-yellow-300 bg-yellow-900/30" : "text-yellow-800 bg-yellow-100"
                  : darkMode ? "text-red-300 bg-red-900/30" : "text-red-800 bg-red-100"
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