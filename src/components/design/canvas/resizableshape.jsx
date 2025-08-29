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
      rotateEnabled={true}
      keepRatio={false}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) return oldBox; // منع التصغير المبالغ
        return newBox;
      }}
    onTransformEnd={() => {
  const node = shapeRef.current;
  if (!node) return;

  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  node.scaleX(1);
  node.scaleY(1);

  let newProps = {
    x: node.x(),
    y: node.y(),
    rotation: node.rotation(),
  };

  if (type === "circle") {
    newProps.radius = (node.width() * scaleX) / 2;
  } else if (type === "ellipse") {
    newProps.radiusX = (node.width() * scaleX) / 2;
    newProps.radiusY = (node.height() * scaleY) / 2;
  } else {
    newProps.width = Math.max(5, node.width() * scaleX);
    newProps.height = Math.max(5, node.height() * scaleY);
  }

  // هنا أهم شيء: أرسل newProps إلى الـ state
  onTransformEnd?.(newProps);
}}

    />
  );
};

export default ResizableShape;
