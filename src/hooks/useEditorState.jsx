import { useEffect, useState, useRef } from 'react';

export const useEditorState = (defaultElements, storageKey = 'editor-elements') => {
  const [elements, setElements] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultElements;
  });

  const [selectedElementId, setSelectedElementId] = useState(null);
  const [drawElementId, setDrawElementId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef();
  const [isFocused, setIsFocused] = useState(document.hasFocus());

  //  حفظ العناصر في localStorage عند التعديل
  useEffect(() => {
localStorage.setItem(storageKey, JSON.stringify(elements)); //  الصحيح
  }, [elements]);


useEffect(() => {
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  window.addEventListener('focus', handleFocus);
  window.addEventListener('blur', handleBlur);

  return () => {
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('blur', handleBlur);
  };
}, []);


  //  إضافة الصورة عند اللصق من الحافظة
 useEffect(() => {
  if (!isFocused) return;

  const handlePaste = (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.indexOf("image") === 0) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = () => {
          const imageSrc = reader.result;
          const id = Date.now().toString();
          setElements(prev => [
            ...prev,
            {
              id,
              type: 'image',
              src: imageSrc,
              x: 50,
              y: 50,
              width: 200,
              height: 200,
              draggable: true,
            },
          ]);
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  window.addEventListener("paste", handlePaste);
  return () => {
    window.removeEventListener("paste", handlePaste);
  };
}, [isFocused, setElements]);

  return {
    elements,
    setElements,
    selectedElementId,
    setSelectedElementId,
    drawElementId,
    setDrawElementId,
    isDrawing,
    setIsDrawing,
    stageRef,
  };
};
