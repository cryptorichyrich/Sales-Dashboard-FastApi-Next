import { useState, useEffect } from "react";

// Layout components
import Container from "../components/layout/Container";
import Header from "../components/layout/Header";

// Sales components
import SalesRepsList from "../components/sales/SalesRepList";
import RegionFilter from "../components/sales/RegionFilter";

// AI Chat components
import FloatingChat from "../components/ai/FloatingChat";
import FloatingChatButton from "../components/ai/FloatingChatButton";

// Health Status component
import HealthStatusIndicator from "../components/system/HealthStatusIndicator";

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

  // Calculate deal statistics
  const dealStats = {
    total: {
      count: salesReps.reduce((acc, rep) => acc + rep.deals.length, 0),
      value: salesReps.reduce(
        (acc, rep) => acc + rep.deals.reduce((sum, deal) => sum + deal.value, 0),
        0
      )
    },
    won: {
      count: salesReps.reduce(
        (acc, rep) => acc + rep.deals.filter(deal => deal.status === "Closed Won").length,
        0
      ),
      value: salesReps.reduce(
        (acc, rep) => 
          acc + rep.deals
            .filter(deal => deal.status === "Closed Won")
            .reduce((sum, deal) => sum + deal.value, 0),
        0
      )
    },
    lost: {
      count: salesReps.reduce(
        (acc, rep) => acc + rep.deals.filter(deal => deal.status === "Closed Lost").length,
        0
      ),
      value: salesReps.reduce(
        (acc, rep) => 
          acc + rep.deals
            .filter(deal => deal.status === "Closed Lost")
            .reduce((sum, deal) => sum + deal.value, 0),
        0
      )
    },
    running: {
      count: salesReps.reduce(
        (acc, rep) => acc + rep.deals.filter(deal => deal.status === "In Progress").length,
        0
      ),
      value: salesReps.reduce(
        (acc, rep) => 
          acc + rep.deals
            .filter(deal => deal.status === "In Progress")
            .reduce((sum, deal) => sum + deal.value, 0),
        0
      )
    }
  };

  // Region list for filtering
  const regions = [...new Set(salesReps.map((rep) => rep.region))];

  // Filter sales reps by region
  const filteredSalesReps = selectedRegion
    ? salesReps.filter((rep) => rep.region === selectedRegion)
    : salesReps;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <Header title="Sales Dashboard" />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Enhanced Health Status Indicator */}
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

        {/* Sales Representatives Section with Filter */}
        <section className="mb-8 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-blue-400">
              Sales Representatives
            </h2>
            <RegionFilter
              regions={regions}
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              darkMode={darkMode}
            />
          </div>

          {loading ? (
            <div className="w-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSalesReps.map((rep) => (
                <SalesRepCard key={rep.id} rep={rep} darkMode={darkMode} />
              ))}
            </div>
          )}
        </section>
      </Container>
      
      {/* Floating Chat */}
      {isChatOpen ? (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 h-[480px] md:h-[520px] md:rounded-lg shadow-xl z-50 overflow-hidden">
          <FloatingChat 
            chatMessages={chatMessages}
            question={question}
            setQuestion={setQuestion}
            handleAskQuestion={handleAskQuestion}
            onClose={() => setIsChatOpen(false)}
            darkMode={darkMode}
          />
        </div>
      ) : (
        <FloatingChatButton 
          onClick={() => setIsChatOpen(true)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

// Dashboard Card Component
const DashboardCard = ({ title, value, icon, darkMode }) => {
  return (
    <div className={`rounded-lg shadow-md p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {value}
          </p>
        </div>
        <div className={`rounded-full w-12 h-12 flex items-center justify-center ${
          darkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-100 text-blue-600'
        }`}>
          {icon === "users" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          {icon === "briefcase" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
          {icon === "dollar" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Dashboard Card with Subsections
const EnhancedDashboardCard = ({ title, value, icon, darkMode, subsections }) => {
  return (
    <div className={`rounded-lg shadow-md p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {value}
          </p>
        </div>
        <div className={`rounded-full w-12 h-12 flex items-center justify-center ${
          darkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-100 text-blue-600'
        }`}>
          {icon === "users" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          {icon === "briefcase" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
          {icon === "dollar" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
      </div>
      
      {/* Subsections */}
      <div className={`grid grid-cols-3 gap-2 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {subsections.map((section, index) => (
          <div key={index} className="text-center">
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {section.label}
            </p>
            <p className={`text-lg font-semibold ${section.colorClass}`}>
              {section.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sales Rep Card Component
const SalesRepCard = ({ rep, darkMode }) => {
  return (
    <div className={`h-full rounded-lg shadow-md p-6 transition-colors duration-300 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-xl font-bold mb-2 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {rep.name}
      </h3>
      <p className={`mb-4 ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {rep.role} | {rep.region}
      </p>
      
      <div className={`rounded-md p-4 mb-4 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <strong className={`block mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Skills:</strong>
        <div className="flex flex-wrap gap-2">
          {rep.skills.map((skill) => (
            <span
              key={skill}
              className={`text-xs px-2 py-1 rounded-full ${
                darkMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <strong className={`block mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Deals:</strong>
        {rep.deals.map((deal, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-3 rounded-md mb-2 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <div>
              <span className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {deal.client}
              </span>
              <span className={`ml-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                ${deal.value.toLocaleString()}
              </span>
            </div>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                deal.status === "Closed Won"
                  ? darkMode ? "text-green-300 bg-green-900/30" : "text-green-800 bg-green-100"
                  : deal.status === "In Progress"
                  ? darkMode ? "text-yellow-300 bg-yellow-900/30" : "text-yellow-800 bg-yellow-100"
                  : darkMode ? "text-red-300 bg-red-900/30" : "text-red-800 bg-red-100"
              }`}
            >
              {deal.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};