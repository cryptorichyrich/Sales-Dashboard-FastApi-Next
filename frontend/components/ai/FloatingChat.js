import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const FloatingChat = ({ chatMessages, question, setQuestion, handleAskQuestion, onClose, darkMode }) => {
  const messagesEndRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Toggle fullscreen state
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`flex flex-col overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 h-screen w-screen rounded-none' 
          : 'h-full rounded-lg'
      } ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      {/* Chat header */}
      <div className={`flex justify-between items-center p-4 border-b ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-600 text-white border-blue-500'
      }`}>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            darkMode ? 'bg-blue-600' : 'bg-blue-500 bg-opacity-30'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-white">Sales Assistant</h2>
            <p className="text-xs text-blue-100">Ask questions about sales data</p>
          </div>
        </div>
        <div className="flex items-center">
          {/* Fullscreen toggle button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 mr-2 rounded-full hover:bg-gray-800 hover:bg-opacity-20 transition-colors focus:outline-none"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H6a1 1 0 01-1-1v-3zm7-1a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 hover:bg-opacity-20 transition-colors focus:outline-none"
            aria-label="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Messages container */}
      <div className={`flex-grow overflow-y-auto p-4 ${
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
              How can I help you today?
            </h3>
            <p className={`text-sm max-w-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Ask me about sales performance, team stats, or specific representatives.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((message, index) => (
              <ChatMessage key={index} message={message} darkMode={darkMode} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className={`p-4 border-t ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex">
          <input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleAskQuestion();
              }
            }}
            className={`flex-grow p-3 rounded-l-lg border focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-400'
            }`}
          />
          <button
            onClick={handleAskQuestion}
            disabled={!question.trim()}
            className={`px-4 rounded-r-lg flex items-center justify-center ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600'
                : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300'
            } disabled:cursor-not-allowed transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className={`text-xs mt-2 text-center ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>Press CTRL+Enter to send</p>
      </div>
    </div>
  );
};

// Chat Message Component with Markdown support
const ChatMessage = ({ message, darkMode }) => {
  const isUser = message.type === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </div>
      )}
      
      <div
        className={`max-w-[80%] p-3 rounded-lg overflow-auto prose prose-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none prose-invert"
            : darkMode ? "bg-gray-700 text-white rounded-tl-none prose-invert" : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        {isUser ? (
          <div>{message.text}</div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default FloatingChat;