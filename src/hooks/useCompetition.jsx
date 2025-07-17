import { useState, useEffect } from 'react';
import { fetchCompetitions } from '../services/competitionserv';

const useCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCompetitions = async () => {
      try {
        const data = await fetchCompetitions();
        setCompetitions(data);
      } catch (err) {
        console.error("Error fetching competitions:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    getCompetitions();
  }, []);

  return { competitions, loading, error };
};

export default useCompetitions;
