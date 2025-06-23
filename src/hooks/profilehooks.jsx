import { useEffect, useState, useCallback } from 'react';
import { profile } from '../services/profileserv';

const useProfile = () => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        return JSON.parse(storedUser);
      }
    } catch (err) {
      console.error('فشل في قراءة بيانات المستخدم من localStorage:', err);
      localStorage.removeItem('user'); //  تنظيف في حال وجود JSON غير صالح
    }
    return null;
  });

  const [loading, setLoading] = useState(!user); // تحميل فقط إذا لم يكن لدينا بيانات محلية

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await profile();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user)); // ✅ حفظ محدث
      }
    } catch (error) {
      console.error('حدث خطأ أثناء جلب الملف الشخصي:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [fetchProfile, user]);

  return { user, loading, refetch: fetchProfile };
};

export default useProfile;