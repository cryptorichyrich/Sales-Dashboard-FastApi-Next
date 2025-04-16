import { useState, useEffect } from "react";

// Layout components
import Container from "../components/layout/Container";
import Header from "../components/layout/Header";

// Sales components
import SalesRepsList from "../components/sales/SalesRepList";
import DashboardCard from "../components/sales/DashboardCard";
import EnhancedDashboardCard from "../components/sales/EnhancedDashboardCard";

// AI Chat components
import FloatingChat from "../components/ai/FloatingChat";
import FloatingChatButton from "../components/ai/FloatingChatButton";

// Health Status component
import HealthStatusIndicator from "../components/system/HealthStatusIndicator";

// Custom hooks
import useSalesData from "../hooks/useSalesData";
import useChat from "../hooks/useChat";

export default function Home() {
  // Fetch sales data and analytics
  const { salesReps, loading, dealStats } = useSalesData();
  
  // Chat functionality
  const { question, setQuestion, chatMessages, handleAskQuestion } = useChat();
  
  // Region filter state
  const [selectedRegion, setSelectedRegion] = useState("");
  
  // Theme state
  const [darkMode, setDarkMode] = useState(true);
  
  // Chat visibility state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Update body class when theme changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <Header title="Sales Dashboard" />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Health Status Indicator */}
            <HealthStatusIndicator darkMode={darkMode} />
            
            {/* Theme Toggle Switch */}
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                className="sr-only"
                checked={darkMode}
                onChange={toggleTheme}
                id="theme-toggle"
              />
              <label
                htmlFor="theme-toggle"
                className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-300 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              >
                <span 
                  className={`absolute inset-y-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 flex items-center justify-center ${
                    darkMode ? 'translate-x-6 bg-gray-800' : ''
                  }`}
                >
                  {darkMode ? (
                    <svg className="w-3 h-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Dashboard Summary */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard 
            title="Total Sales Reps" 
            value={salesReps.length} 
            icon="users"
            darkMode={darkMode}
          />
          <EnhancedDashboardCard 
            title="Total Deals" 
            value={dealStats.total.count} 
            icon="briefcase"
            darkMode={darkMode}
            subsections={[
              { label: "Won", value: dealStats.won.count, colorClass: "text-green-400" },
              { label: "Running", value: dealStats.running.count, colorClass: "text-yellow-400" },
              { label: "Lost", value: dealStats.lost.count, colorClass: "text-red-400" }
            ]}
          />
          <EnhancedDashboardCard 
            title="Total Deal Value" 
            value={`$${dealStats.total.value.toLocaleString()}`} 
            icon="dollar"
            darkMode={darkMode}
            subsections={[
              { label: "Won Value", value: `$${dealStats.won.value.toLocaleString()}`, colorClass: "text-green-400" },
              { label: "Running Value", value: `$${dealStats.running.value.toLocaleString()}`, colorClass: "text-yellow-400" },
              { label: "Lost Value", value: `$${dealStats.lost.value.toLocaleString()}`, colorClass: "text-red-400" }
            ]}
          />
        </div>

        {/* Sales Representatives Section */}
        <SalesRepsList 
          salesReps={salesReps} 
          loading={loading} 
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          darkMode={darkMode}
        />
      </Container>
      
      {/* Floating Chat */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 h-[480px] md:h-[520px] md:rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300">
          <FloatingChat 
            chatMessages={chatMessages}
            question={question}
            setQuestion={setQuestion}
            handleAskQuestion={handleAskQuestion}
            onClose={() => setIsChatOpen(false)}
            darkMode={darkMode}
          />
        </div>
      )}
      
      {/* Show chat button only when chat is closed */}
      {!isChatOpen && (
        <FloatingChatButton 
          onClick={() => setIsChatOpen(true)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}