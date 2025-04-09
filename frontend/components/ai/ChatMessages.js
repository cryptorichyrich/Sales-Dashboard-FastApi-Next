import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage = ({ message }) => {
  return (
    <div
      className={`mb-4 flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          message.type === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {message.type === "ai" ? (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="markdown-content"
            components={{
              h1: 'h1',
              h2: 'h2',
              code: ({node, ...props}) => (
                <code 
                  className="bg-gray-100 text-red-500 px-1 py-0.5 rounded-md"
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
    </div>
  );
};

export default ChatMessage;