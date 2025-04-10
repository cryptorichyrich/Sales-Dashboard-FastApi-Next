import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage = ({ message, darkMode }) => {
  const isUser = message.type === "user";
  
  return (
    <div className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar for AI */}
      {!isUser && (
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
          darkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-100 text-blue-600'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <div
        className={`max-w-[85%] p-4 rounded-lg shadow-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : darkMode
              ? "bg-gray-600 text-white"
              : "bg-gray-200 text-gray-800"
        }`}
      >
        {message.type === "ai" ? (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="markdown-content"
            components={{
              h1: ({node, ...props}) => <h1 className="text-lg font-bold my-3" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-md font-bold my-2" {...props} />,
              p: ({node, ...props}) => <p className="mb-2" {...props} />,
              ul: ({node, ...props}) => <ul className="my-2 pl-2" {...props} />,
              ol: ({node, ...props}) => <ol className="my-2 pl-2" {...props} />,
              code: ({node, ...props}) => (
                <code 
                  className={`px-1 py-0.5 rounded-md ${
                    darkMode 
                      ? "bg-gray-800 text-green-400" 
                      : "bg-gray-100 text-red-500"
                  }`}
                  {...props} 
                />
              ),
              li: ({node, ...props}) => (
                <li className="ml-4 list-disc mb-1" {...props} />
              ),
              a: ({node, ...props}) => (
                <a 
                  className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} underline`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  {...props} 
                />
              ),
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-gray-500" {...props} />
                </div>
              ),
              th: ({node, ...props}) => (
                <th 
                  className={`px-4 py-2 text-left ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`} 
                  {...props} 
                />
              ),
              td: ({node, ...props}) => (
                <td 
                  className={`px-4 py-2 ${
                    darkMode ? 'border-gray-700' : 'border-gray-300'
                  }`} 
                  {...props} 
                />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        ) : (
          message.text
        )}
      </div>
      
      {/* Avatar for User */}
      {isUser && (
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ml-3 ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;