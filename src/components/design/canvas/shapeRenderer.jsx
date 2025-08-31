import React, { useRef, useState } from 'react';
import {
  Text,
  Rect,
  Circle,
  Ellipse,
  Line,
  Shape,
  Image as KonvaImage,
} from 'react-konva';
import ResizableShape from '../canvas/resizableshape';
import useImage from 'use-image';


//  مكون خاص برسم الصور
const ImageElement = ({ element, isSelected, onSelect, onDragEnd, onTransformEnd }) => {
  const [image] = useImage(element.src);
  const shapeRef = useRef();

  return (
    <>
      <KonvaImage
        image={image}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        draggable
        ref={shapeRef}
        onClick={() => onSelect(element.id)}
        onTap={() => onSelect(element.id)}
        onDragEnd={(e) =>
          onDragEnd(element.id, {
            x: e.target.x(),
            y: e.target.y(),
          })
        }
        stroke={isSelected ? 'blue' : null}
        strokeWidth={isSelected ? 2 : 0}
      />
      {isSelected && (
        <ResizableShape
          shapeRef={shapeRef}
          isSelected
          onTransformEnd={(newProps) => {
            onTransformEnd(element.id, newProps);
          }}
        />
      )}
    </>
  );
};


const ShapeRenderer = ({
  elements,
  handleSelect,
  handleDragEnd,
  handleTextEdit,
  selectedId,
}) => {
  const [editingId, setEditingId] = useState(null);

  return (
    <>
      {elements.map((el) => {
        const shadowProps =
          el.shadow && el.type !== 'text'
            ? {
                shadowColor: `rgba(${el.shadow.color.r}, ${el.shadow.color.g}, ${el.shadow.color.b}, ${el.shadow.color.a})`,
                shadowOffset: { x: el.shadow.offsetX, y: el.shadow.offsetY },
                shadowBlur: el.shadow.blur,
              }
            : {};

        const shapeRef = React.createRef();

        const commonProps = {
          ...el,
          ref: shapeRef,
          draggable: true,
          onClick: () => handleSelect(el.id),
          onTap: () => handleSelect(el.id),
          onDragEnd: (e) =>
            handleDragEnd(el.id, {
              x: e.target.x(),
              y: e.target.y(),
            }),
        };

        // 🟡 النصوص
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
                  textarea.style.color = el.fill;
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
                <ResizableShape shapeRef={shapeRef} isSelected />
              )}
            </React.Fragment>
          );
        }

        // 🟢 بقية العناصر حسب النوع
        switch (el.type) {
          case 'rect':
            return (
             <React.Fragment key={el.id}>
  <Rect {...commonProps} {...shadowProps} />
  {selectedId === el.id && (
    <ResizableShape
      shapeRef={shapeRef}
      isSelected
      onTransformEnd={(newProps) => handleDragEnd(el.id, newProps)}
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
      onTransformEnd={(newProps) => handleDragEnd(el.id, newProps)}
    />
  )}
</React.Fragment>

            )
          case 'line':
          case 'line-horizontal':
          case 'line-vertical':
          case 'draw':
            return (
              <React.Fragment key={el.id}>
                <Line {...commonProps} {...shadowProps} />
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
                    ctx.fillStyle = el.fill;
                    ctx.fill();
                    ctx.strokeShape(shape);
                  }}
                />
                {selectedId === el.id && (
                  <ResizableShape shapeRef={shapeRef} isSelected />
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
  onDragEnd={handleDragEnd}

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
