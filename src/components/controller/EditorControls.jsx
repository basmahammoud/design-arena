import { v4 as uuidv4 } from 'uuid';
import { handleAddElement } from '../design/canvas/editor/editorHandlers';
// تحديث خصائص عنصر موجود
export const handleUpdateShape = (id, newProps, setElements) => {
  if (!id) return;
  setElements(prev =>
    prev.map(shape => (shape && shape.id === id ? { ...shape, ...newProps } : shape))
  );
};

// بعد سحب العنصر وإفلاته
export const handleDragEnd = (id, newPosition, setElements) => {
  if (!id || !newPosition) return;
  setElements(prev =>
    prev.map(el =>
      el && el.id === id ? { ...el, x: newPosition.x, y: newPosition.y } : el
    )
  );
};

// تعديل نص عنصر
export const handleTextEdit = (id, newText, setElements) => {
  if (!id) return;
  setElements(prev =>
    prev.map(el => (el && el.id === id ? { ...el, text: newText } : el))
  );
};

// إضافة صورة جديدة

export const handleImageAdd = (imageSrc, updateFn, activateColorPicker, setDrawElementId) => {
  if (!imageSrc) return;
  handleAddElement("image", activateColorPicker, setDrawElementId, updateFn, imageSrc);
};


// حذف عنصر محدد
export const handleDeleteElement = (selectedId, setElements, setSelectedId) => {
  if (!selectedId) return;
  setElements(prev => prev.filter(el => el && el.id !== selectedId));
  setSelectedId(null);
};
