// hooks/useSaveDesign.js
import { useState } from 'react';
import { saveWebDesign } from '../services/savebuttonserv';
import { updateDesign } from '../services/profileserv';

export const useSaveDesign = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveDesign = async ({ elements, imageBase64, name = '', designId = null }) => {
    setIsSaving(true);
    try {
      if (designId) {
        // تحديث التصميم إذا كان لدينا معرف
        await updateDesign(designId, {
          name,
          json_data: elements,
          image_base64: imageBase64,
        });
      } else {
        // إنشاء تصميم جديد
        await saveWebDesign({
          name,
          elements,
          imageBase64,
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveDesign, isSaving };
};
