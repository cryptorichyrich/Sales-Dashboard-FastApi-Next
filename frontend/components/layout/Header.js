import React from 'react';
import HealthStatusIndicator from '../system/HealthStatusIndicator';

const Header = ({ title }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default Header;