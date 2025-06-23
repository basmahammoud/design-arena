import { useEffect } from 'react';

const useDeleteElementOnKeypress = (selectedElementId, setElements, setSelectedElementId) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedElementId) {
        setElements((prev) => prev.filter((el) => el.id !== selectedElementId));
        setSelectedElementId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, setElements, setSelectedElementId]);
};

export default useDeleteElementOnKeypress;
