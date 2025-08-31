import { Transformer } from 'react-konva';
import { useEffect, useRef } from 'react';
import React from 'react';

const ResizableShape = ({ shapeRef, isSelected, onTransformEnd, type }) => {
  const transformerRef = useRef();

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <Transformer
      ref={transformerRef}
      boundBoxFunc={(oldBox, newBox) => {
        // منع التصغير الزائد
        if (newBox.width < 5 || newBox.height < 5) return oldBox;
        return newBox;
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale to avoid accumulation
        node.scaleX(1);
        node.scaleY(1);

        const width = node.width() * scaleX;
        const height = node.height() * scaleY;

        let newProps;

        if (type === 'oval') {
          // للشكل البيضاوي نحسب نصف العرض والطول
          newProps = {
            x: node.x(),
            y: node.y(),
            radiusX: width / 2,
            radiusY: height / 2,
            rotation: node.rotation(),
          };
        } else {
          // لبقية الأشكال
          newProps = {
            x: node.x(),
            y: node.y(),
            width,
            height,
            rotation: node.rotation(),
          };
        }

        onTransformEnd?.(newProps);
      }}
    />
  );
};

export default ResizableShape;
