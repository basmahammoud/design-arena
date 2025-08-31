import { useEffect } from "react";
import { getWebDesign } from "../services/savebuttonserv";

export const useEditorLifecycle = ({
  initialDesignId,
  setPages,
  setCanvasSize,
  setDesignId,
  type,
  user,
  loading,
  navigate,
  currentPageIndex
}) => {
  useEffect(() => {
    if (!initialDesignId) return;

    const fetchDesign = async () => {
      try {
        const res = await getWebDesign(initialDesignId);
        console.log("id",initialDesignId);

        if (!res || !res.design) {
          console.warn("لم يتم العثور على التصميم:", res);
          return;
        }

        const design = res.design;
        const parsed = design.json_data;

        if (parsed && Array.isArray(parsed.pages)) {
          setPages(parsed.pages);

          setCanvasSize(
            type === "mobile"
              ? { width: 390, height: 844 }
              : { width: 1200, height: 800 }
          );

          setDesignId(design.id);
        } else {
          console.warn("التصميم موجود لكن pages غير موجودة أو غير صالحة:", parsed);
        }
      } catch (error) {
        console.error("فشل في جلب التصميم:", error);
      }
    };

    fetchDesign();
  }, [
    initialDesignId,
    setPages,
    setCanvasSize,
    setDesignId,
    type,
    currentPageIndex
  ]);

  useEffect(() => {
    if (!loading && !user) {
      alert("يجب تسجيل الدخول أولاً");
      navigate("/");
    }
  }, [user, loading, navigate]);
};
