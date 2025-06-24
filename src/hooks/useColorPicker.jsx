import html2canvas from 'html2canvas';

export const useColorPicker = ({ stageRef, selectedElementId, setElements }) => {
  const activate = () => {
    if (!selectedElementId) {
      alert('يرجى تحديد عنصر أولاً');
      return;
    }

    document.body.style.cursor = 'crosshair';

    const handleClick = async (e) => {
      const stage = stageRef.current.getStage();
      const container = stage.container();
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      try {
        const canvas = await html2canvas(container, { backgroundColor: null });
        const ctx = canvas.getContext('2d');
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

        setElements((prev) =>
          prev.map((el) =>
            el.id === selectedElementId ? { ...el, fill: color } : el
          )
        );
      } catch (err) {
        console.error('Color Picker Error:', err);
      }

      document.body.style.cursor = 'default';
      document.removeEventListener('click', handleClick);
    };

    setTimeout(() => {
      document.addEventListener('click', handleClick);
    }, 100);
  };

  return { activate };
};
