import React from 'react';

const FloatingChatButton = ({ onClick, darkMode }) => {
  return (
    <button 
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 focus:outline-none ${
        darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
      }`}
      aria-label="Open chat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </button>
  );
};

export default FloatingChatButton;