import { useEffect } from "react";
import { getWebDesign } from "../services/savebuttonserv";

export const useEditorLifecycle = ({
  initialDesignId,
  setPages,
  setElements,
  setCanvasSize,
  setDesignId,
  type,
  user,
  loading,
  navigate,
  currentPageIndex
}) => {
  // جلب التصميم عند وجود designId
  useEffect(() => {
    if (initialDesignId) {
      const fetchDesign = async () => {
        try {
          const res = await getWebDesign(initialDesignId);
          const design = res.design;
          const parsed = design.json_data;

          if (parsed && Array.isArray(parsed.pages)) {
            setPages(parsed.pages);

            // ضبط العناصر الخاصة بالصفحة الحالية
            setElements(parsed.pages[currentPageIndex]?.elements || []);

            // ضبط حجم الكانفس
            setCanvasSize(
              type === "mobile"
                ? { width: 390, height: 844 }
                : { width: 1200, height: 800 }
            );

            setDesignId(design.id);
          } else {
            console.warn("التصميم موجود لكن pages غير موجودة:", parsed);
          }
        } catch (error) {
          console.error("فشل في جلب التصميم:", error);
        }
      };
      fetchDesign();
    }
  }, [
    initialDesignId,
    setPages,
    setElements,
    setCanvasSize,
    setDesignId,
    type,
    currentPageIndex,
  ]);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!loading && !user) {
      alert("يجب تسجيل الدخول أولاً");
      navigate("/");
    }
  }, [user, loading, navigate]);
};
