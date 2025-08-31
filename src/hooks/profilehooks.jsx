import { useEffect, useState, useCallback } from 'react';
import { profile } from '../services/profileserv';

const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isGuest = localStorage.getItem('guest') === 'true';

  const fetchProfile = useCallback(async () => {
    if (isGuest) {
      setLoading(false); 
      return;
    }

    setLoading(true);
    try {
      const data = await profile();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('حدث خطأ أثناء جلب الملف الشخصي:', error);
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, loading, refetch: fetchProfile };
};

export default useProfile;
