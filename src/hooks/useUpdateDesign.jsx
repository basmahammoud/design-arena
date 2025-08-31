import { useState } from 'react';
import { updateDesign } from '../services/profileserv';

const useUpdateDesign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 const handleUpdateDesign = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🎯 تحديث التصميم ID:', id, 'البيانات:', data);
      const result = await updateDesign(id, data);
      console.log('✅ التحديث تم بنجاح:', result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'فشل التعديل';
      console.error('❌ خطأ في التحديث:', errorMessage, err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateDesign, loading, error };
};

export default useUpdateDesign;
