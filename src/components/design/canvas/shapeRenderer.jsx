import React, { useRef, useState } from 'react';
import { Text, Rect, Circle, Shape, Image as KonvaImage } from 'react-konva';
import ResizableShape from '../canvas/resizableshape';
import useImage from 'use-image';
import { handleUpdateShape } from '../../controller/EditorControls';

const ImageElement = ({ element, isSelected, onSelect, onDragEnd, onTransformEnd, setElements }) => {
  const [image] = useImage(element.src, "anonymous"); 
  const shapeRef = useRef();

  if (!image) return null;

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={element.x}
        y={element.y}
        width={element.width || image.width}
        height={element.height || image.height}
        draggable
        onClick={() => onSelect(element.id)}
        onTap={() => onSelect(element.id)}
        onDragEnd={(e) => onDragEnd(element.id, { x: e.target.x(), y: e.target.y() })}
      />
      {isSelected && (
        <Rect
          x={element.x}
          y={element.y}
          width={element.width || image.width}
          height={element.height || image.height}
          stroke="blue"
          strokeWidth={2}
          dash={[4, 4]}
        />
      )}
      {isSelected && (
        <ResizableShape
          shapeRef={shapeRef}
          isSelected
          type="image"
          onTransformEnd={(newProps) => handleUpdateShape(element.id, newProps, setElements)}
        />
      )}
    </>
  );
};

const ShapeRenderer = ({ elements, handleSelect, handleDragEnd, handleTextEdit, selectedId, setElements, onDelete }) => {
  const [editingId, setEditingId] = useState(null);

  if (!Array.isArray(elements)) return null;

  return (
    <>
      {elements.filter(Boolean).map((el) => {
        const shadowProps = el?.shadow?.color
          ? {
              shadowColor: `rgba(${el.shadow.color.r}, ${el.shadow.color.g}, ${el.shadow.color.b}, ${el.shadow.color.a})`,
              shadowOffset: { x: el.shadow.offsetX ?? 5, y: el.shadow.offsetY ?? 5 },
              shadowBlur: el.shadow.blur ?? 10,
            }
          : {};

        const fillSafe = typeof el.fill === 'string' ? el.fill : 'rgba(255,255,255,1)';
        const shapeRef = React.createRef();

        const commonProps = {
          ...el,
          ref: shapeRef,
          draggable: true,
          fill: fillSafe,
          onClick: () => handleSelect(el.id),
          onTap: () => handleSelect(el.id),
          onDragEnd: (e) => handleDragEnd(el.id, { x: e.target.x(), y: e.target.y() }),
        };

        if (el.type === 'text') {
          const isEditing = editingId === el.id;

          return (
            <React.Fragment key={el.id}>
              <Text
                {...commonProps}
                visible={!isEditing}
                onDblClick={(e) => {
                  setEditingId(el.id);
                  const container = e.target.getStage().container();
                  const textPosition = e.target.getAbsolutePosition();
                  const stageBox = container.getBoundingClientRect();
                  const areaPosition = {
                    x: stageBox.left + textPosition.x,
                    y: stageBox.top + textPosition.y,
                  };

                  const textarea = document.createElement('textarea');
                  textarea.value = el.text;
                  textarea.style.position = 'absolute';
                  textarea.style.top = areaPosition.y + 'px';
                  textarea.style.left = areaPosition.x + 'px';
                  textarea.style.width = e.target.width() + 'px';
                  textarea.style.height = e.target.height() + 'px';
                  textarea.style.fontSize = el.fontSize + 'px';
                  textarea.style.border = '1px solid #ccc';
                  textarea.style.padding = '2px';
                  textarea.style.margin = '0px';
                  textarea.style.overflow = 'hidden';
                  textarea.style.background = 'white';
                  textarea.style.outline = 'none';
                  textarea.style.resize = 'none';
                  textarea.style.lineHeight = e.target.lineHeight();
                  textarea.style.fontFamily = e.target.fontFamily();
                  textarea.style.transformOrigin = 'left top';
                  textarea.style.textAlign = el.align;
                  textarea.style.color = el.fill || '#000';
                  textarea.style.zIndex = 100;
                  textarea.style.whiteSpace = 'nowrap';
                  textarea.style.transform = `rotate(${el.rotation || 0}deg)`;
                  textarea.focus();
                  textarea.style.height = 'auto';
                  textarea.style.height = textarea.scrollHeight + 'px';

                  textarea.addEventListener('input', () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = textarea.scrollHeight + 'px';
                  });

                  const adjustWidth = () => {
                    const span = document.createElement('span');
                    span.innerText = textarea.value || ' ';
                    span.style.fontSize = textarea.style.fontSize;
                    span.style.fontFamily = textarea.style.fontFamily;
                    span.style.visibility = 'hidden';
                    span.style.whiteSpace = 'pre';
                    span.style.position = 'absolute';
                    span.style.padding = textarea.style.padding;
                    document.body.appendChild(span);
                    textarea.style.width = span.offsetWidth + 10 + 'px';
                    document.body.removeChild(span);
                  };

                  adjustWidth();
                  textarea.addEventListener('input', adjustWidth);
                  document.body.appendChild(textarea);
                  textarea.focus();

                  let isRemoved = false;
                  const removeTextarea = () => {
                    if (isRemoved) return;
                    isRemoved = true;
                    handleTextEdit(el.id, textarea.value);
                    setEditingId(null);
                    document.body.removeChild(textarea);
                  };

                  textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') removeTextarea();
                  });
                  textarea.addEventListener('blur', () => {
                    removeTextarea();
                  });
                }}
              />
              {selectedId === el.id && (
                <ResizableShape
                  shapeRef={shapeRef}
                  isSelected
                  type="text"
                  onTransformEnd={(newProps) => handleUpdateShape(el.id, newProps, setElements)}
                />
              )}
            </React.Fragment>
          );
        }

        switch (el.type) {
          case 'rect':
            return (
              <React.Fragment key={el.id}>
                <Rect {...commonProps} {...shadowProps} />
                {selectedId === el.id && (
                  <ResizableShape
                    shapeRef={shapeRef}
                    isSelected
                    type="rect"
                    onTransformEnd={(newProps) => handleUpdateShape(el.id, newProps, setElements)}
                  />
                )}
              </React.Fragment>
            );
          case 'circle':
            return (
              <React.Fragment key={el.id}>
                <Circle {...commonProps} {...shadowProps} />
                {selectedId === el.id && (
                  <ResizableShape
                    shapeRef={shapeRef}
                    isSelected
                    type="circle"
                    onTransformEnd={(newProps) => handleUpdateShape(el.id, newProps, setElements)}
                  />
                )}
              </React.Fragment>
            );
          case 'triangle':
            return (
              <React.Fragment key={el.id}>
                <Shape
                  {...commonProps}
                  {...shadowProps}
                  sceneFunc={(ctx, shape) => {
                    ctx.beginPath();
                    ctx.moveTo(el.points[0], el.points[1]);
                    ctx.lineTo(el.points[2], el.points[3]);
                    ctx.lineTo(el.points[4], el.points[5]);
                    ctx.closePath();
                    ctx.fillStyle = fillSafe;
                    ctx.fill();
                    ctx.strokeShape(shape);
                  }}
                />
                {selectedId === el.id && (
                  <ResizableShape
                    shapeRef={shapeRef}
                    isSelected
                    type="triangle"
                    onTransformEnd={(newProps) => handleUpdateShape(el.id, newProps, setElements)}
                  />
                )}
              </React.Fragment>
            );
          case 'image':
            return (
              <ImageElement
                key={el.id}
                element={el}
                isSelected={selectedId === el.id}
                onSelect={handleSelect}
                onDragEnd={(id, pos) => handleDragEnd(id, pos)}
                onTransformEnd={(id, newProps) => handleUpdateShape(id, newProps, setElements)}
                setElements={setElements}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default ShapeRenderer;
