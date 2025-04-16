import { useState } from 'react';

const useChat = () => {
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    // Add user question to chat
    const userMessage = {
      type: 'user',
      text: question
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    // Clear input field
    setQuestion('');
    
    // Set loading state
    setIsLoading(true);
    setError(null);
    
    try {
      // Make API request to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.text }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add AI response to chat
      const aiMessage = {
        type: 'assistant',
        text: data.answer
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error asking question:', err);
      setError(err.message);
      
      // Add error message to chat
      const errorMessage = {
        type: 'assistant',
        text: `Sorry, I encountered an error: ${err.message}. Please try again later.`
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    question,
    setQuestion,
    chatMessages,
    setChatMessages,
    isLoading,
    error,
    handleAskQuestion
  };
};

export default useChat;