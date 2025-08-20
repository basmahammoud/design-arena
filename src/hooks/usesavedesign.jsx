import { useState } from 'react';
import { saveWebDesign } from '../services/savebuttonserv';
import { updateDesign } from '../services/profileserv';

export const useSaveDesign = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveDesign = async ({ elements, imageBase64, name = '', designId = null, canvasSize, type }) => {
    setIsSaving(true);
    try {
      console.log('✅ designId at save call:', designId);

      // نبني json_data ونضيف فيه الأبعاد/النوع
      const jsonWithMeta = {
        name,
        pages: [
          {
            elements,    // العناصر
         meta_data: {
        type,
        width: type === "mobile" ? 390 : 1440,
        height: type === "mobile" ? 844 : 900,
      }
          }
        ],
        meta_data: { }
        
      };
console.log("📦 jsonWithMeta to save:", JSON.stringify(jsonWithMeta, null, 2));

      if (designId) {
        await updateDesign(designId, {
          name,
          json_data: jsonWithMeta,   // نرسل كائن كامل
          image_base64: Array.isArray(imageBase64) ? imageBase64 : [imageBase64],
        });
      } else {
        await saveWebDesign({
          name,
          elements,
          imageBase64,
          json_data: jsonWithMeta,   // مهم جدًا عشان الحفظ الجديد
        });
      }
    } catch (error) {
      console.error('❌ Error at saveDesign:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveDesign, isSaving };
};
