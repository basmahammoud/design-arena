// src/hooks/useLogin.js
import { useState } from 'react';
import { loginRequest, verify } from '../services/auth'; 

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(credentials);

      localStorage.setItem('token', data.access_token);
      localStorage.removeItem('guest');

      const user = data.user; // تأكد أن `user` موجود في استجابة loginRequest

      if (!user.email_verified_at) {
        await verify(user.email); //  ارسال كود جديد
        throw { response: { status: 403, data: { message: 'Account not verified' } } };
      }

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
