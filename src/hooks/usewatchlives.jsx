import { useState, useEffect } from 'react';
import { Lives as fetchLives } from '../services/streming'; 

const useLives = () => {
  const [lives, setLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLives = async () => {
      try {
        const data = await fetchLives();
        setLives(data);
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء تحميل البثوث');
      } finally {
        setLoading(false);
      }
    };

    loadLives();
  }, []);

  return { lives, loading, error };
};

export default useLives;
