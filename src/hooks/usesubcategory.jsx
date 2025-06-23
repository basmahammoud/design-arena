import { useEffect, useState } from 'react';
import { fetchSubcategories } from '../services/coursesserv'; 

const useSubcategories = (id) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const load = async () => {
    setLoading(true); // تأكد من إعادة التحميل حتى بعد الرجوع
    setError(null);
    try {
      const data = await fetchSubcategories(id);
      setSubcategories(data);
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


  return { subcategories, loading, error };
};

export default useSubcategories;
