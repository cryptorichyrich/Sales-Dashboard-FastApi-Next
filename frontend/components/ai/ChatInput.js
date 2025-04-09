import React from 'react';

const ChatInput = ({ question, setQuestion, handleAskQuestion }) => {
  // Handle key down for CTRL+ENTER
  const handleKeyDown = (e) => {
    // Check for Enter key or CTRL+Enter combination
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAskQuestion();
    }
  };

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Ask a question about sales... (Press CTRL+ENTER to send)"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow p-2 border rounded-l-lg"
      />
      <button
        onClick={handleAskQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
      >
        Ask
      </button>
    </div>
  );
};

export default ChatInput;