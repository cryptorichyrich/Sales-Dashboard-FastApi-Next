import React from 'react';
import ChatMessage from './ChatMessages';
import ChatInput from './ChatInput';

const ChatSection = ({ chatMessages, question, setQuestion, handleAskQuestion }) => {
  return (
    <section className="bg-gray-100 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Ask About Sales
      </h2>
      
      <div className="bg-white border rounded-lg h-96 overflow-y-auto p-4 mb-4">
        {chatMessages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      
      <ChatInput
        question={question}
        setQuestion={setQuestion}
        handleAskQuestion={handleAskQuestion}
      />
    </section>
  );
};

export default ChatSection;