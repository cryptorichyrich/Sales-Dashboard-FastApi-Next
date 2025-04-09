import { useState } from "react";

// Layout components
import Container from "../components/layout/Container";
import Header from "../components/layout/Header";

// Sales components
import SalesRepsList from "../components/sales/SalesRepList";

// AI Chat components
import ChatSection from "../components/ai/ChatSection";

// Custom hooks
import useSalesData from "../hooks/useSalesData";
import useChat from "../hooks/useChat";

export default function Home() {
  // Fetch sales data
  const { salesReps, loading } = useSalesData();
  
  // Chat functionality
  const { question, setQuestion, chatMessages, handleAskQuestion } = useChat();
  
  // Region filter state
  const [selectedRegion, setSelectedRegion] = useState("");

  return (
    <Container>
      <Header title="Sales Dashboard" />

      {/* Sales Representatives Section */}
      <SalesRepsList 
        salesReps={salesReps} 
        loading={loading} 
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {/* AI Chat Section */}
      <ChatSection 
        chatMessages={chatMessages}
        question={question}
        setQuestion={setQuestion}
        handleAskQuestion={handleAskQuestion}
      />
    </Container>
  );
}