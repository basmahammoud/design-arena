export const handleSave = async ({
  pages, elements, setElements, stageRef,
  setCurrentPageIndex, currentPageIndex,
  canvasSize, designId, saveDesign
}) => {
  try {
    const stage = stageRef.current.getStage();
    if (!stage) throw new Error("Stage غير موجود");

    const originalElements = [...elements];
    const originalPageIndex = currentPageIndex;

    const updatedPages = [];

    for (let idx = 0; idx < pages.length; idx++) {
      const page = pages[idx];
      setElements(page.elements || []);
      setCurrentPageIndex(idx);

      await new Promise(r => setTimeout(r, 50));
      stage.batchDraw?.();

      let snapshot = stage.toDataURL({ pixelRatio: 2 });

      if (!page.elements || page.elements.length === 0) {
        const layer = stage.getLayers()[0];
        const rect = new window.Konva.Rect({
          x: 0,
          y: 0,
          width: stage.width(),
          height: stage.height(),
          fill: page.backgroundColor || '#ffffff'
        });
        layer.add(rect);
        layer.batchDraw();
        snapshot = stage.toDataURL({ pixelRatio: 2 });
        rect.destroy();
      }

      updatedPages.push({
        ...page,
        meta_data: {
          ...page.meta_data,
          imageBase64: snapshot
        }
      });
    }

    setElements(originalElements);
    setCurrentPageIndex(originalPageIndex);

    const coverImage = updatedPages[0]?.meta_data?.imageBase64 || "";

    await saveDesign({
      pages: updatedPages,
      name: "new design",
      designId,
      canvasSize,
      type: canvasSize?.width === 390 ? "mobile" : "web",
      previewImage: coverImage
    });

    alert("تم الحفظ بنجاح مع صور مستقلة لكل صفحة");
  } catch (err) {
    console.error("خطأ أثناء الحفظ:", err);
    alert("فشل الحفظ");
  }
};
