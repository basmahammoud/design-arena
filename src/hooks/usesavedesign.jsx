import { useState } from "react";
import { saveWebDesign } from "../services/savebuttonserv";
import { updateDesign } from "../services/profileserv";

// 🖼️ snapshot حقيقي من stage (Konva)
const generateSnapshotFromStage = (stage) => {
  if (!stage) return "";
  return stage.toDataURL({ pixelRatio: 2 }); // دقة أعلى
};

export const useSaveDesign = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveDesign = async ({
    pages,
    name = "",
    designId = null,
    canvasSize = { width: 1200, height: 800 },
    type = "web",
    previewImage = null,
  }) => {
    setIsSaving(true);

    try {
      if (!pages || !Array.isArray(pages) || pages.length === 0) {
        console.error("📛 لا توجد صفحات للحفظ");
        return;
      }

      // 🖼️ توليد snapshot لكل صفحة
      const formattedPages = await Promise.all(
        pages.map(async (page, index) => {
          let snapshot = page.meta_data?.imageBase64 || "";

          // ⚡ لو الصفحة معها stage من Konva → خذ snapshot حقيقي
          if (page.stage && typeof page.stage.toDataURL === "function") {
            snapshot = generateSnapshotFromStage(page.stage);
          }

          return {
            id: page.id || Date.now() + index,
            name: page.name || `صفحة ${index + 1}`,
            elements: Array.isArray(page.elements) ? page.elements : [],
            backgroundColor:
              typeof page.backgroundColor === "number"
                ? page.backgroundColor
                : 0xffffff,
            meta_data: {
              ...(page.meta_data && typeof page.meta_data === "object"
                ? page.meta_data
                : {}),
              imageBase64: snapshot,
            },
          };
        })
      );

      // عدد العناصر
      const elementsCount = formattedPages.reduce(
        (sum, page) =>
          sum + (Array.isArray(page.elements) ? page.elements.length : 0),
        0
      );

      // JSON النهائي
      const jsonWithMeta = {
        name,
        pages: formattedPages,
        meta_data: {
          canvasSize,
          type,
          pagesCount: formattedPages.length,
          elementsCount,
          previewImage:
            previewImage || formattedPages[0]?.meta_data?.imageBase64 || "",
        },
      };

      console.log("📦 jsonWithMeta to save:", jsonWithMeta);

      // الصور بالترتيب الصحيح
      const imageBase64Array = formattedPages
        .map((p) => p.meta_data?.imageBase64)
        .filter(Boolean);

      if (designId) {
        // تحديث تصميم
        const formData = new FormData();
        formData.append("name", name);
        formData.append("json_data", JSON.stringify(jsonWithMeta));
        imageBase64Array.forEach((img) =>
          formData.append("image_base64[]", img)
        );
        await updateDesign(designId, formData);
      } else {
        // حفظ جديد
        await saveWebDesign({
          pages: formattedPages,
          imageBase64: imageBase64Array,
          name,
        });
      }

      console.log("✅ الحفظ تم بنجاح");
    } catch (error) {
      console.error("❌ Error at saveDesign:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveDesign, isSaving };
};
