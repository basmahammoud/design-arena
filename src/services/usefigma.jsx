import { useState } from 'react';

const useExportToFigma = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportToFigma = async (designId) => {
    setLoading(true);
    setError(null);

    try {
      const figmaUrl = `http://localhost:8000/api/design/${designId}/figma`;

      window.open(figmaUrl, '_blank');

    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء التصدير');
    } finally {
      setLoading(false);
    }
  };

  return { exportToFigma, loading, error };
};

export default useExportToFigma;