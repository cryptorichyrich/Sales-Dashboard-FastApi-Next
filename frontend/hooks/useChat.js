import { useState } from 'react';

const useChat = () => {
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    // Store the current question
    const currentQuestion = question;
    
    // Clear input immediately for better UX
    setQuestion("");

    // Add user message to chat
    const userMessage = {
      type: "user",
      text: currentQuestion,
    };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/ai', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      });
      const data = await response.json();

      // Add AI response to chat
      const aiMessage = {
        type: "ai",
        text: data.answer || data.response,
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in AI request:", error);

      // Add error message to chat
      const errorMessage = {
        type: "ai",
        text: "Sorry, there was an error processing your request.",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    }
  };

  return {
    question,
    setQuestion,
    chatMessages,
    handleAskQuestion
  };
};

export default useChat;