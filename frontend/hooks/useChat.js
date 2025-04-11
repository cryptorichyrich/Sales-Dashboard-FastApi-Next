import { useState } from 'react';

const useChat = () => {
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    // Skip if question is empty or currently loading
    if (!question.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { type: 'user', text: question };
    setChatMessages((prev) => [...prev, userMessage]);

    // Clear input field
    setQuestion('');

    // Set loading state
    setIsLoading(true);

    try {
      // Make API request to backend
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Add AI response to chat
      setChatMessages((prev) => [
        ...prev,
        { type: 'ai', text: data.answer || 'Sorry, I couldn\'t process your request.' },
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      
      // Add error message to chat
      setChatMessages((prev) => [
        ...prev,
        { 
          type: 'ai', 
          text: 'Sorry, there was an error connecting to the AI service. Please try again later.' 
        },
      ]);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  return {
    question,
    setQuestion,
    chatMessages,
    setChatMessages,
    isLoading,
    handleAskQuestion,
  };
};

export default useChat;