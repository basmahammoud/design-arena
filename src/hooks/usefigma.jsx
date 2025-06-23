import { useState } from 'react';
import { exportDesignToFigma } from '../services/figma';

const useExportToFigma = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exportToFigma = async (designId) => {
    setLoading(true);
    setError(null);

    try {
      const figmaUrl = await exportDesignToFigma(designId);
       window.open(figmaUrl, '_blank');
      //window.open(`https://www.figma.com/file/XYZ?plugin-data=${encodeURIComponent(json)}`);

    } catch (err) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return { exportToFigma, loading, error };
};

export default useExportToFigma;
