import { v4 as uuidv4 } from 'uuid';


export const handleUpdateShape = (id, newProps, setElements) => {
  setElements((prev) =>
    prev.map((shape) => (shape.id === id ? { ...shape, ...newProps } : shape))
  );
};

export const handleDragEnd = (id, newProps, updateFn) => {
  updateFn((prevElements) =>
    prevElements.map((el) =>
      el.id === id ? { ...el, ...newProps } : el
    )
  );
};


export const handleTextEdit = (id, newText, setElements) => {
  setElements((prev) =>
    prev.map((el) => (el.id === id ? { ...el, text: newText } : el))
  );
};


export const handleImageAdd = (imageSrc, setElements) => {
  const newImage = {
    id: uuidv4(),
    type: 'image',
    src: imageSrc,
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  };

  setElements((prev) => {
    const updated = [...prev, newImage];
    localStorage.setItem('editor-elements', JSON.stringify(updated));
    return updated;
  });
};

export const handleDeleteElement = (selectedId, setElements, setSelectedId) => {
  if (!selectedId) return;
  setElements((prev) => prev.filter((el) => el.id !== selectedId));
  setSelectedId(null);
};




