import React, { useState, useEffect, useRef } from 'react';

const HealthStatusIndicator = ({ darkMode }) => {
  const [status, setStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef(null);

  // Handle click outside to close details panel
  useEffect(() => {
    function handleClickOutside(event) {
      if (detailsRef.current && !detailsRef.current.contains(event.target) && 
          !event.target.closest('.health-indicator-trigger')) {
        setShowDetails(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const checkHealth = async () => {
    try {
      setStatus('checking');
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/health');
      const data = await response.json();
      
      setHealthData(enhanceHealthData(data));
      
      if (data.status === 'healthy') {
        setStatus('online');
      } else {
        setStatus('issues');
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setStatus('offline');
      setHealthData({
        overview: {
          status: 'offline',
          timestamp: new Date().toISOString(),
          error: error.message
        }
      });
    }
    
    setLastChecked(new Date());
  };

  useEffect(() => {
    // Check health when component mounts
    checkHealth();
    
    // Set up interval to check health every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    
    // Clean up interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'issues':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Enhanced the health data with more information
  const enhanceHealthData = (data) => {
    if (!data) return null;
    
    // Process the provided data with the new structure
    return formatHealthData(data);
  };
  
  const formatHealthData = (data) => {
    // Prepare services array from components
    const servicesArray = data.components ? Object.entries(data.components).map(([name, info]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      status: info.status,
      details: (() => {
        if (name === 'system') {
          return {
            memory: `${((info.memory.total - info.memory.available) / info.memory.total * 100).toFixed(1)}% Used`,
            cpu: `${info.cpu.usage}% Utilization`
          };
        }
        if (name === 'gemini_api') {
          return { reason: info.reason };
        }
        return null;
      })()
    })) : [];
    
    return {
      overview: {
        status: data.status,
        timestamp: new Date(data.timestamp * 1000).toISOString(),
        version: data.version || "N/A",
        environment: "Production" // Default since not provided in the JSON
      },
      services: servicesArray,
      metrics: {
        systemMemory: `${((data.components.system.memory.total - data.components.system.memory.available) / data.components.system.memory.total * 100).toFixed(1)}%`,
        cpuUsage: `${data.components.system.cpu.usage}%`,
        averageResponseTime: data.components.datastore?.responseTime ? `${data.components.datastore.responseTime}ms` : 'N/A',
        requestsPerMinute: "N/A" // Not provided in the JSON
      }
    };
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown";
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };
  
  const getServiceStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'up':
      case 'healthy':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'disabled':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      case 'down':
      case 'unhealthy':
        return darkMode ? 'text-red-400' : 'text-red-600';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className="relative">
      {/* Health Indicator Button */}
      <button
        onClick={toggleDetails}
        className={`health-indicator-trigger inline-flex items-center rounded-full py-1.5 px-3 ${
          darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
        } shadow-sm transition-colors duration-150 border ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
        aria-label="Server health status"
      >
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} mr-2`} />
        <span className={`text-xs font-medium ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          API: {status}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-3.5 w-3.5 ml-1.5 transition-transform ${showDetails ? 'rotate-180' : 'rotate-0'} ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Health Details Panel */}
      {showDetails && healthData && (
        <div 
          ref={detailsRef}
          className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-lg shadow-lg z-50 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } overflow-hidden animate-fade-in`}
        >
          {/* Header */}
          <div className={`px-4 py-3 border-b ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex justify-between items-center">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Server Health Status
              </h3>
              <button 
                onClick={() => checkHealth()}
                className={`p-1 rounded hover:bg-opacity-80 ${
                  darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
                aria-label="Refresh health data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last updated: {lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}
            </p>
          </div>
          
          {/* Overview */}
          <div className={`px-4 py-3 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                status === 'online' 
                  ? darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-700'
                  : status === 'issues'
                    ? darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                    : darkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-700'
              }`}>
                {status === 'online' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : status === 'issues' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {status === 'online' ? 'System Healthy' : status === 'issues' ? 'System Degraded' : 'System Offline'}
                </h4>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Environment: {healthData.overview.environment} | Version: {healthData.overview.version}
                </p>
              </div>
            </div>
          </div>
          
          {/* Services */}
          {healthData.services && healthData.services.length > 0 && (
            <div className={`px-4 py-3 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                System Components
              </h4>
              <div className="space-y-2">
                {healthData.services.map((service, index) => (
                  <div key={index} className={`flex flex-col py-1 px-2 rounded ${
                    darkMode ? 'bg-gray-750' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          service.status.toLowerCase() === 'up' ? 'bg-green-500' :
                          service.status.toLowerCase() === 'disabled' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {service.name}
                        </span>
                      </div>
                      <span className={`text-xs ${getServiceStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                    {service.details && (
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {service.name === 'System' && (
                          <>
                            <p>Memory: {service.details.memory}</p>
                            <p>CPU: {service.details.cpu}</p>
                          </>
                        )}
                        {service.name === 'Gemini_api' && service.details.reason && (
                          <p>Reason: {service.details.reason}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Metrics */}
          {healthData.metrics && (
            <div className={`px-4 py-3 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Performance Metrics
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard
                  title="System Memory"
                  value={healthData.metrics.systemMemory}
                  icon="memory"
                  darkMode={darkMode}
                />
                <MetricCard
                  title="CPU Usage"
                  value={healthData.metrics.cpuUsage}
                  icon="cpu"
                  darkMode={darkMode}
                />
                <MetricCard
                  title="Response Time"
                  value={healthData.metrics.averageResponseTime}
                  icon="clock"
                  darkMode={darkMode}
                />
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="px-4 py-2 text-center">
            <button 
              onClick={() => setShowDetails(false)}
              className={`text-xs ${
                darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Metric Card Component for displaying performance metrics
const MetricCard = ({ title, value, icon, darkMode }) => {
  return (
    <div className={`p-2 rounded-lg text-center ${
      darkMode ? 'bg-gray-750' : 'bg-gray-50'
    }`}>
      <div className="flex justify-center mb-1">
        {icon === 'memory' && (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${
            darkMode ? 'text-blue-400' : 'text-blue-500'
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        )}
        {icon === 'cpu' && (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${
            darkMode ? 'text-green-400' : 'text-green-500'
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        )}
        {icon === 'clock' && (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${
            darkMode ? 'text-red-400' : 'text-red-500'
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <p className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {title}
      </p>
      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {value}
      </p>
    </div>
  );
};

export default HealthStatusIndicator;