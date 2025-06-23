import { useState, useEffect } from 'react';
import { fetchSubvideos } from '../services/coursesserv';

const useSubvideos = (id) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSubvideos(id);
        // إذا data هو كائن كامل
        setVideos(data.videos || []);  
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  return { videos, loading, error };
};

export default useSubvideos;
