// hooks/useSaveDesign.js
import { useState } from 'react';
import { saveWebDesign } from '../services/savebuttonserv';

export const useSaveDesign = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveDesign = async ({ elements, imageBase64, name = '' }) => {
    setIsSaving(true);
    try {
      await saveWebDesign({
        elements,
        imageBase64,
        name
      });
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveDesign, isSaving };
};

