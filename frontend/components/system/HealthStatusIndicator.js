import React, { useState, useEffect } from 'react';

const HealthStatusIndicator = () => {
  const [status, setStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      const data = await response.json();
      
      if (data.status === 'healthy') {
        setStatus('online');
      } else {
        setStatus('issues');
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setStatus('offline');
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

  const getStatusStyles = () => {
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

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${getStatusStyles()}`}></div>
      <span className="text-sm text-gray-600">
        API: {status === 'checking' ? 'Checking...' : status}
      </span>
      {lastChecked && (
        <span className="text-xs text-gray-400">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
      <button 
        onClick={checkHealth}
        className="text-xs text-blue-500 hover:text-blue-700"
      >
        Refresh
      </button>
    </div>
  );
};

export default HealthStatusIndicator;