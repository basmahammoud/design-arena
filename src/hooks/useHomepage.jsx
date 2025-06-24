// hooks/useHomepage.js أو useDesigns.js
import { useEffect, useState } from "react";
import { viewDesigns } from "../services/homeserv";

const useHomeDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const data = await viewDesigns();

        // استخراج feed من الرد
        if (data.feed) {
          setDesigns(data.feed);
        } else {
          setError("لا يوجد بيانات تصميم متاحة");
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل التصاميم");
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  return { designs, loading, error };
};

export default useHomeDesigns;
