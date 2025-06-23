import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Stage,
  Layer,
  Text,
  Rect,
  Circle,
  Ellipse,
  Line,
  Shape,
  Group,
  Image as KonvaImage,
} from 'react-konva';
import useImage from 'use-image';
import './preview.css';
import ImageModal from '../imgmodel'; 

// مكون لتحميل الصورة
const ImageShape = ({ imageSrc, x, y, width, height, draggable, onClick }) => {
  const [img] = useImage(imageSrc);
  return (
    <KonvaImage
      image={img}
      x={x}
      y={y}
      width={width}
      height={height}
      draggable={draggable}
      onClick={onClick}
    />
  );
};

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { elements: initialElements, canvasSize, scale } = location.state || {};

  const [elements, setElements] = useState(initialElements || []);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);

 const handleImageClick = (src, id) => {
    setSelectedImageSrc(src);
    setSelectedImageId(id);
  };

  const handleImageChange = (newSrc) => {
    // تحديث رابط الصورة في قائمة العناصر
    const updated = elements.map(el => 
    el.id === selectedImageId ? { ...el, src: newSrc } : el    
     );
    setElements(updated);
  };

  if (!elements || !canvasSize) {
    return <div>لا توجد بيانات للعرض.</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={() => navigate(-1)}>×</button>
        <Stage width={canvasSize.width} height={canvasSize.height}>
          <Layer scale={{ x: scale, y: scale }} offset={{ x: 0, y: 0 }}>
            {elements.map((el) => {
              switch (el.type) {
                case 'text':
                  return <Text key={el.id} {...el} />;
                case 'rect':
                  return <Rect key={el.id} {...el} />;
                case 'circle':
                  return <Circle key={el.id} {...el} />;
                case 'oval':
                  return (
                    <Ellipse
                      key={el.id}
                      x={el.x}
                      y={el.y}
                      radiusX={el.radiusX}
                      radiusY={el.radiusY}
                      fill={el.fill}
                    />
                  );
                case 'image':
                  return (
                    <ImageShape
                      key={el.id}
                     imageSrc={el.src}
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      draggable={el.draggable}
                      onClick={() => handleImageClick(el.imageSrc, el.id)}
                    />
                  );
                case 'triangle':
                  return (
                    <Group key={el.id} x={el.x} y={el.y}>
                      <Shape
                        sceneFunc={(context, shape) => {
                          context.beginPath();
                          context.moveTo(el.points[0], el.points[1]);
                          context.lineTo(el.points[2], el.points[3]);
                          context.lineTo(el.points[4], el.points[5]);
                          context.closePath();
                          context.fillStyle = el.fill;
                          context.fill();
                          context.strokeShape(shape);
                        }}
                      />
                    </Group>
                  );
                case 'line':
                case 'line-horizontal':
                case 'line-vertical':
                case 'draw':
                  return <Line key={el.id} {...el} lineCap="round" />;
                default:
                  return null;
              }
            })}
          </Layer>
        </Stage>

        {/* عرض الـ Modal عند الضغط على صورة */}
        {selectedImageSrc && (
          <ImageModal
            src={selectedImageSrc}
            onClose={() => setSelectedImageSrc(null)}
            onImageChange={handleImageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Preview;
