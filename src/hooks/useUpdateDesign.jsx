// src/hooks/useUpdateDesign.js
import { useState } from 'react';
import { updateDesign } from '../services/profileserv';

const useUpdateDesign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdateDesign = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateDesign(id, data);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'فشل التعديل');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateDesign, loading, error };
};

export default useUpdateDesign;
