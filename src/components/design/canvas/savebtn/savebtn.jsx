import { useSaveDesign } from '../../../../hooks/usesavedesign';
import { FaSave } from 'react-icons/fa';
import { useState } from 'react';

const SaveButton = ({
  pages = [],
  canvasSize,
  stageRef,
  designId,
  elements = [],
  setElements,
  currentPageIndex = 0,
  setCurrentPageIndex
}) => {
  const { saveDesign, isSaving } = useSaveDesign();
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const handleSave = async () => {
    try {
      if (!Array.isArray(pages) || pages.length === 0) {
        alert(" لا توجد صفحات للحفظ.");
        return;
      }

      const stage = stageRef?.current?.getStage?.();
      if (!stage) {
        alert(" تعذر الوصول إلى الـ Stage.");
        return;
      }

      setIsGeneratingImages(true);

      const canSwapPages =
        typeof setElements === 'function' &&
        typeof setCurrentPageIndex === 'function';

      let updatedPages = [];

      if (canSwapPages) {
        const originalElements = Array.isArray(elements) ? [...elements] : [];
        const originalIndex = Number.isInteger(currentPageIndex) ? currentPageIndex : 0;

        try {
          for (let idx = 0; idx < pages.length; idx++) {
            const page = pages[idx];

            setCurrentPageIndex(idx);
            setElements(Array.isArray(page.elements) ? page.elements : []);

            await new Promise((r) => setTimeout(r, 200));
             stage.batchDraw?.();
             await new Promise((r) => requestAnimationFrame(r));

            const snapshot = stage.toDataURL({ pixelRatio: 2 });

            updatedPages.push({
              ...page,
              meta_data: {
                ...page.meta_data,
                imageBase64: snapshot,
              },
            });
          }

          setCurrentPageIndex(originalIndex);
          setElements(originalElements);
          await new Promise((r) => setTimeout(r, 30));
          stage.batchDraw?.();

          const coverImage =
            updatedPages[originalIndex]?.meta_data?.imageBase64 || updatedPages[0]?.meta_data?.imageBase64 || "";

          await saveDesign({
            pages: updatedPages,
            name: 'new design',
            designId,
            canvasSize,
            type: canvasSize?.width === 390 ? "mobile" : "web",
            previewImage: coverImage
          });

        } catch (innerErr) {
          setElements(originalElements);
          setCurrentPageIndex(originalIndex);
          stage.batchDraw?.();
          throw innerErr;
        }

      } else {
        console.warn("SaveButton: لم يتم تمرير setElements / setCurrentPageIndex؛ سيتم حفظ صورة الصفحة الحالية فقط.");

        const currentSnapshot = stage.toDataURL({ pixelRatio: 2 });

        updatedPages = pages.map((p, idx) => ({
          ...p,
          meta_data: {
            ...p.meta_data,
            imageBase64: idx === currentPageIndex
              ? currentSnapshot
              : (p.meta_data?.imageBase64 || ""), //حفظ النسخة القديمة
          },
        }));

        const coverImage =
          updatedPages[currentPageIndex]?.meta_data?.imageBase64 || updatedPages[0]?.meta_data?.imageBase64 || "";

        await saveDesign({
          pages: updatedPages,
          name: 'new design',
          designId,
          canvasSize,
          type: canvasSize?.width === 390 ? "mobile" : "web",
          previewImage: coverImage
        });
      }

      alert(' تم حفظ التصميم بنجاح');

    } catch (error) {
      console.error(" خطأ أثناء الحفظ:", error);
      alert(' فشل في الحفظ');
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <button
      className="save-btn"
      onClick={handleSave}
      disabled={isSaving || isGeneratingImages}
      title="حفظ التصميم"
    >
      <FaSave />
    </button>
  );
};

export default SaveButton;
