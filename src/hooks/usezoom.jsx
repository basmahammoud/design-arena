import { useState } from "react";

const useZoom = () => {
  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.3));
  const resetZoom = () => setZoom(1);
  return { zoom, handleZoomIn, handleZoomOut, resetZoom };
};

export default useZoom;
