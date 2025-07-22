import { useState, useEffect } from 'react';
import { fetchSubvideos } from '../services/coursesserv';

const useSubvideos = (id) => {
  const [videos, setVideos] = useState([]);
  const [sub, setSub] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSubvideos(id);
        setVideos(data.videos || []);
        setSub(data.sub || null);
        setHasAccess(data.hasAccess || false);
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

  return { videos, sub, hasAccess, loading, error };
};

export default useSubvideos;
