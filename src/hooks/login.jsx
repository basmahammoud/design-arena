// src/hooks/useLogin.js
import { useState } from 'react';
import { loginRequest } from '../services/auth';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(credentials);

      localStorage.setItem('token', data.access_token);

      // 🟢 أزل وضع الزائر في حال كان موجودًا
      localStorage.removeItem('guest');

      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
