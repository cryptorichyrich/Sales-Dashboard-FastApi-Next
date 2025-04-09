import React from 'react';

const Header = ({ title }) => {
  return (
    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
      {title}
    </h1>
  );
};

export default Header;