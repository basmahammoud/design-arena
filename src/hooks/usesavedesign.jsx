import { useState } from 'react';
import { saveWebDesign } from '../services/savebuttonserv';
import { updateDesign } from '../services/profileserv';

export const useSaveDesign = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveDesign = async ({ 
    pages, 
    name = '', 
    designId = null, 
    canvasSize = { width: 1200, height: 800 }, 
    type = 'web',
    previewImage = null //  صورة الغلاف (thumbnail)
  }) => {
    setIsSaving(true);

    try {
      if (!pages || !Array.isArray(pages) || pages.length === 0) {
        console.error("📛 لا توجد صفحات للحفظ");
        return;
      }

      //  حساب عدد العناصر
      const elementsCount = pages.reduce(
        (sum, page) => sum + (Array.isArray(page.elements) ? page.elements.length : 0),
        0
      );

      //  تجهيز الصفحات للتخزين
      const formattedPages = pages.map((page, index) => ({
        id: page.id || Date.now() + index,
        name: page.name || `صفحة ${index + 1}`,
        elements: Array.isArray(page.elements) ? page.elements : [],
        backgroundColor: typeof page.backgroundColor === 'number' ? page.backgroundColor : 16777215,
        meta_data: {
          ...((page.meta_data && typeof page.meta_data === 'object') ? page.meta_data : {}),
          //  snapshot إما من الصفحة أو من previewImage أو ""
          imageBase64: page.meta_data?.imageBase64 || "",
        },
      }));

      //  JSON النهائي
      const jsonWithMeta = {
        name,
        pages: formattedPages,
        meta_data: {
          canvasSize,
          type,
          pagesCount: pages.length,
          elementsCount,
           previewImage: previewImage || formattedPages[0]?.meta_data?.imageBase64 || ""
        }
      };

      console.log("📦 jsonWithMeta to save:", JSON.stringify(jsonWithMeta, null, 2));

      //  الصور المجمعة
      const imageBase64Array = formattedPages
        .map(p => p.meta_data?.imageBase64)
        .filter(Boolean);

      //  إضافة صورة الغلاف أول المصفوفة
      if (previewImage) {
        imageBase64Array.unshift(previewImage);
      }

      if (designId) {
        // تحديث تصميم موجود
        const formData = new FormData();
        formData.append('name', name);
        formData.append('json_data', JSON.stringify(jsonWithMeta));
        imageBase64Array.forEach(img => formData.append(`image_base64[]`, img));

        await updateDesign(designId, formData);
      } else {
        // حفظ تصميم جديد
        await saveWebDesign({
          pages: formattedPages,
          imageBase64: imageBase64Array,
          name
        });
      }

      console.log("✅ الحفظ تم بنجاح");

    } catch (error) {
      console.error('❌ Error at saveDesign:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveDesign, isSaving };
};
