import React from 'react';

const Container = ({ children, className = '' }) => {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-4 py-8 ${className}`}>
      {children}
    </div>
  );
};

export default Container;