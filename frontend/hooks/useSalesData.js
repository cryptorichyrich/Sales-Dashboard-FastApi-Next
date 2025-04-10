import { useState, useEffect } from 'react';

const useSalesData = () => {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/data');
        const data = await res.json();
        setSalesReps(data.salesReps || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to fetch sales data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { salesReps, loading, error };
};

export default useSalesData;