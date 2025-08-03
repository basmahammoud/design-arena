import { useEffect, useState } from 'react';
import { getDesign } from '../services/savebuttonserv';

const useUserDesigns = (userId) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchDesigns = async () => {
      try {
        const data = await getDesign(userId);
        setDesigns(data.designs || []); // نأخذ فقط designs
      } catch (err) {
        setError('حدث خطأ أثناء جلب التصاميم');
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [userId]);

  return { designs, loading, error };
};

export default useUserDesigns;
