import { useState, useEffect } from 'react';

const useSalesData = () => {
  const [salesReps, setSalesReps] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalDealCount: 0,
    dealStatusSummary: {
      "Closed Won": 0,
      "In Progress": 0,
      "Closed Lost": 0
    },
    totalDealValue: 0,
    averageDealValue: 0,
    regionDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both sales reps data and analytics in parallel
        const [salesResponse, analyticsResponse] = await Promise.all([
          fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/data'),
          fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/sales-analytics')
        ]);
        
        if (!salesResponse.ok) {
          throw new Error(`HTTP error! Status: ${salesResponse.status}`);
        }
        
        if (!analyticsResponse.ok) {
          throw new Error(`HTTP error! Status: ${analyticsResponse.status}`);
        }
        
        const salesData = await salesResponse.json();
        const analyticsData = await analyticsResponse.json();
        
        setSalesReps(salesData.salesReps || []);
        setAnalytics(analyticsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load sales data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare dealStats in the format expected by the components
  const dealStats = {
    total: {
      count: analytics.totalDealCount,
      value: analytics.totalDealValue
    },
    won: {
      count: analytics.dealStatusSummary["Closed Won"],
      value: 0 // We'll need to enhance the API to get this value
    },
    lost: {
      count: analytics.dealStatusSummary["Closed Lost"],
      value: 0 // We'll need to enhance the API to get this value
    },
    running: {
      count: analytics.dealStatusSummary["In Progress"],
      value: 0 // We'll need to enhance the API to get this value
    }
  };

  // If the API doesn't provide values by status type yet, calculate them from salesReps
  if (salesReps.length > 0 && dealStats.won.value === 0) {
    dealStats.won.value = salesReps.reduce(
      (acc, rep) => 
        acc + rep.deals
          .filter(deal => deal.status === "Closed Won")
          .reduce((sum, deal) => sum + deal.value, 0),
      0
    );
    
    dealStats.lost.value = salesReps.reduce(
      (acc, rep) => 
        acc + rep.deals
          .filter(deal => deal.status === "Closed Lost")
          .reduce((sum, deal) => sum + deal.value, 0),
      0
    );
    
    dealStats.running.value = salesReps.reduce(
      (acc, rep) => 
        acc + rep.deals
          .filter(deal => deal.status === "In Progress")
          .reduce((sum, deal) => sum + deal.value, 0),
      0
    );
  }

  return {
    salesReps,
    analytics,
    dealStats,
    loading,
    error,
  };
};

export default useSalesData;