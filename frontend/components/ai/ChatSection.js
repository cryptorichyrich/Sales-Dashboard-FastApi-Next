import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessages';
import ChatInput from './ChatInput';

const ChatSection = ({ chatMessages, question, setQuestion, handleAskQuestion, darkMode }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <section className={`h-full rounded-lg shadow-md overflow-hidden transition-colors duration-300 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className={`px-6 py-4 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            darkMode ? 'bg-blue-600' : 'bg-blue-100'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
              darkMode ? 'text-blue-200' : 'text-blue-600'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Sales Assistant
            </h2>
            <p className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Ask questions about sales performance
            </p>
          </div>
        </div>
      </div>
      
      <div className={`h-[calc(100vh-26rem)] md:h-[30rem] overflow-y-auto p-4 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-gray-800' : 'bg-blue-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-lg font-medium mb-2 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              No messages yet
            </h3>
            <p className={`text-sm max-w-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Start by asking a question about sales performance, team metrics, or specific sales representatives.
            </p>
          </div>
        ) : (
          <>
            {chatMessages.map((message, index) => (
              <ChatMessage key={index} message={message} darkMode={darkMode} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className={`p-4 border-t ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          handleAskQuestion={handleAskQuestion}
          darkMode={darkMode}
        />
      </div>
    </section>
  );
};

export default ChatSection;