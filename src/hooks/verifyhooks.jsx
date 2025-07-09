// src/hooks/useVerify.js
import { useState } from 'react';
import { verify } from '../services/auth';

const useVerify = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // لإضافة معالجة الأخطاء

  const verifyCode = async (code) => {
    setLoading(true);
    try {
      const data = await verify({ code });
      console.log('Response from verify():', data);
      setUser(data.user);
      return true; // ✅ أضف هذا
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Verification failed. Please try again.');
      return false; // ✅ وأيضًا هذا
    } finally {
      setLoading(false);
    }
  };
  

  return { verifyCode, user, loading, error };
};

export default useVerify;
