import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessages';
import ChatInput from './ChatInput';

const FloatingChat = ({ chatMessages, question, setQuestion, handleAskQuestion, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatRef = useRef(null);
  
  // Handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target) && isOpen && !isFullScreen) {
        // Optional: close on outside click when not in fullscreen
        // setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isFullScreen]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Exit fullscreen when closing
    if (isOpen && isFullScreen) {
      setIsFullScreen(false);
    }
  };
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div 
      ref={chatRef}
      className={`fixed transition-all duration-300 z-50 ${
        isFullScreen 
          ? 'inset-0 m-0 rounded-none'
          : isOpen 
            ? 'bottom-4 right-4 w-96 h-[550px] rounded-lg' 
            : 'bottom-4 right-4 w-16 h-16 rounded-full'
      } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-xl`}
    >
      {/* Chat header / toggle button */}
      <div 
        className={`${
          darkMode ? 'bg-gray-700' : 'bg-blue-600 text-white'
        } ${isFullScreen ? '' : 'rounded-t-lg'} flex justify-between items-center p-4`}
      >
        {isOpen ? (
          <>
            <h2 className="font-semibold">Sales Assistant</h2>
            <div className="flex space-x-2">
              {/* Fullscreen toggle button */}
              <button 
                onClick={toggleFullScreen}
                className="focus:outline-none mr-2"
                aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullScreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011 1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              {/* Close button */}
              <button 
                onClick={toggleChat}
                className="focus:outline-none"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={toggleChat}
            className="w-full h-full flex items-center justify-center focus:outline-none"
            aria-label="Open chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Chat content */}
      {isOpen && (
        <div className="flex flex-col h-[calc(100%-80px)] p-4">
          <div className={`${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          } rounded-lg flex-grow overflow-y-auto p-4 mb-4 border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            {chatMessages.length > 0 ? (
              chatMessages.map((message, index) => (
                <ChatMessage key={index} message={message} darkMode={darkMode} />
              ))
            ) : (
              <div className={`text-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } py-12`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="font-medium">How can I help with your sales queries?</p>
                <p className="text-sm mt-2">Ask about sales performance, regional data, or customer insights.</p>
              </div>
            )}
          </div>
          
          <ChatInput
            question={question}
            setQuestion={setQuestion}
            handleAskQuestion={handleAskQuestion}
            darkMode={darkMode}
          />
        </div>
      )}
    </div>
  );
};

export default FloatingChat;