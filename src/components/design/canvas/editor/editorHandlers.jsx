import { createElement } from '../elementsfactory';

export const updateCurrentPageElements = (updatedElements, setPages, setElements, currentPageIndex) => {
  const elementsArray = Array.isArray(updatedElements) ? updatedElements : [updatedElements];

  setPages((prevPages) => {
    const newPages = [...prevPages];
    const currentElements = newPages[currentPageIndex]?.elements || [];

    const mergedElements = currentElements.map((el) => {
      const updated = elementsArray.find((u) => u.id === el.id);
      return updated ? { ...el, ...updated } : el;
    });

    elementsArray.forEach((el) => {
      if (!mergedElements.find((e) => e.id === el.id)) {
        mergedElements.push(el);
      }
    });

    newPages[currentPageIndex] = {
      ...newPages[currentPageIndex],
      elements: mergedElements,
    };
    return newPages;
  });

  setElements((prevElements) => {
    const mergedElements = prevElements.map((el) => {
      const updated = elementsArray.find((u) => u.id === el.id);
      return updated ? { ...el, ...updated } : el;
    });
    elementsArray.forEach((el) => {
      if (!mergedElements.find((e) => e.id === el.id)) {
        mergedElements.push(el);
      }
    });
    return mergedElements;
  });
};


export const setPageBackground = (color, setPages, currentPageIndex) => {
  setPages((prevPages) => {
    const newPages = [...prevPages];
    newPages[currentPageIndex] = {
      ...newPages[currentPageIndex],
      backgroundColor: color,
    };
    return newPages;
  });
};

export const handleAddElement = (type, activateColorPicker, setDrawElementId, updateFn) => {
  if (type === "color-picker") return activateColorPicker();
  const id = Date.now().toString();
  const newElement = createElement(type, id);
  if (!newElement) return;

  if (type === "draw") setDrawElementId(id);

  // تمرير العنصر مباشرة لـ updateFn
  updateFn(newElement);
};


export const resetToDefault = (setPages, setCurrentPageIndex, setElements, defaultElements) => {
  const defaultPage = {
    id: Date.now(),
    name: "صفحة 1",
    elements: defaultElements,
    backgroundColor: "#ffffff",
  };
  setPages([defaultPage]);
  setCurrentPageIndex(0);
  setElements(defaultElements);
};

export const handleMouseDown = (drawElementId, stageRef, setIsDrawing, elements, updateFn) => {
  if (!drawElementId) return;
  const point = stageRef.current.getStage().getPointerPosition();
  setIsDrawing(true);
  updateFn(
    elements.map((el) =>
      el.id === drawElementId
        ? { ...el, points: [...(el.points || []), point.x, point.y] }
        : el
    )
  );
};

export const handleMouseMove = (isDrawing, drawElementId, stageRef, elements, updateFn) => {
  if (!isDrawing || !drawElementId) return;
  const point = stageRef.current.getStage().getPointerPosition();
  updateFn(
    elements.map((el) =>
      el.id === drawElementId
        ? { ...el, points: [...(el.points || []), point.x, point.y] }
        : el
    )
  );
};

export const handleMouseUp = (setIsDrawing, setDrawElementId) => {
  setIsDrawing(false);
  setDrawElementId(null);
};
export const addNewPage = (setPages, setElements, setCurrentPageIndex) => {
  setPages(prev => {
    const newPage = {
      id: Date.now(),
      name: `صفحة ${prev.length + 1}`,
      elements: [],
      backgroundColor: "#ffffff",
    };
    setCurrentPageIndex(prev.length);
    setElements(newPage.elements);
    return [...prev, newPage];
  });
};

export const duplicateCurrentPage = (pages, currentPageIndex, setPages, setElements, setCurrentPageIndex) => {
  if (pages[currentPageIndex]) {
    const copy = {
      ...pages[currentPageIndex],
      id: Date.now(),
      name: `${pages[currentPageIndex].name} (نسخة)`,
      elements: [...pages[currentPageIndex].elements],
    };
    setPages(prev => {
      const updated = [...prev, copy];
      setCurrentPageIndex(updated.length - 1);
      setElements(copy.elements);
      return updated;
    });
  }
};

export const deleteCurrentPage = (pages, currentPageIndex, setPages, setElements, setCurrentPageIndex) => {
  if (pages.length > 1) {
    setPages(prev => {
      const updated = prev.filter((_, idx) => idx !== currentPageIndex);
      const newIndex = Math.max(0, currentPageIndex - 1);
      setCurrentPageIndex(newIndex);
      setElements(updated[newIndex].elements);
      return updated;
    });
  } else {
    alert("لا يمكنك حذف جميع الصفحات!");
  }
};
