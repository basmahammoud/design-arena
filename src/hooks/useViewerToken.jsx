import { useState } from 'react';
import { getViewerToken } from '../services/streaming';

const useViewerToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchToken = async (room) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getViewerToken(room);
      return data; // { token, room }
    } catch (err) {
      setError('فشل في الحصول على التوكن');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchToken, loading, error };
};

export default useViewerToken;
