import React from 'react';

const ChatInput = ({ question, setQuestion, handleAskQuestion, darkMode }) => {
  // Handle key down for CTRL+ENTER
  const handleKeyDown = (e) => {
    // Check for Enter key or CTRL+Enter combination
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAskQuestion();
    }
  };

  return (
    <div className={`flex items-center p-2 rounded-lg border ${
      darkMode 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-white border-gray-300'
    }`}>
      <input
        type="text"
        placeholder="Ask a question about sales performance..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`flex-grow p-2 focus:outline-none ${
          darkMode 
            ? 'bg-gray-700 text-white placeholder-gray-400' 
            : 'bg-white text-gray-800 placeholder-gray-500'
        }`}
        aria-label="Chat input"
      />
      <div className="flex items-center">
        <span className={`hidden md:inline-block text-xs mr-2 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          CTRL+ENTER to send
        </span>
        <button
          onClick={handleAskQuestion}
          disabled={!question.trim()}
          className={`p-2 rounded-full transition-colors ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600'
              : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300'
          } disabled:cursor-not-allowed`}
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;