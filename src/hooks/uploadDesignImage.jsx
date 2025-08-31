import { useState } from 'react';
import { uploadDesignImage } from '../services/profileserv';

const useUploadDesign = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const uploadDesign = async (file) => {
    setUploading(true);
    setError(null);

    try {
      const result = await uploadDesignImage(file);
      setData(result);
      return result;
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadDesign, uploading, error, data };
};

export default useUploadDesign;
