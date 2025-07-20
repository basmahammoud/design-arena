// src/hooks/useregister.js
import { useState } from 'react';
import { registerRequest } from '../services/auth';

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerRequest(credentials);
      localStorage.setItem('token', data.token); 
      return true; // تم التسجيل بنجاح
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useRegister;
