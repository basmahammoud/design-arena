import { useState } from 'react';
import { saveWebDesign } from '../services/savebuttonserv';
import { updateDesign } from '../services/profileserv';

export const useSaveDesign = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveDesign = async ({ elements, imageBase64, name = '', designId = null }) => {
    setIsSaving(true);
    try {
      console.log('✅ designId at save call:', designId);

      if (designId) {
        // نبني json_data بالطريقة الصحيحة:
        const jsonWithName = {
          name,
          pages: [
            {
              elements,                // العناصر هنا مباشرة
              meta_data: {},           // يمكنك تعبئتها إذا عندك بيانات إضافية
              // backgroundColor: "#ffffff" // يمكن أن تجعله ديناميكي إذا عندك متغيّر
            }
          ],
          meta_data: {},              // بيانات عامة للتصميم إذا لزم
        };

        await updateDesign(designId, {
          name,
          json_data: jsonWithName,   // لاحظ: نرسل كائن وليس نصّ، لأن stringify يحصل داخل updateDesign
          image_base64: Array.isArray(imageBase64) ? imageBase64 : [imageBase64],
        });

      } else {
        // إذا تصميم جديد
        await saveWebDesign({
          name,
          elements,
          imageBase64,
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
