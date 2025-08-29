import React, { useRef, useState } from 'react';
import {
  Text,
  Rect,
  Circle,
  Line,
  Shape,
  Image as KonvaImage,
} from 'react-konva';
import ResizableShape from '../canvas/resizableshape';
import useImage from 'use-image';
import { handleUpdateShape } from '../../controller/EditorControls';

const ImageElement = ({ element, isSelected, onSelect, onDragEnd, onTransformEnd, setElements }) => {
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
          onDragEnd(element.id, { x: e.target.x(), y: e.target.y() })
        }
        stroke={isSelected ? 'blue' : null}
        strokeWidth={isSelected ? 2 : 0}
      />
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

const ShapeRenderer = ({ elements, handleSelect, handleDragEnd, handleTextEdit, selectedId, setElements ,onDelete}) => {
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
            handleDragEnd(el.id, { x: e.target.x(), y: e.target.y() }),
        };

        // النصوص
        if (el.type === 'text') {
          const isEditing = editingId === el.id;

          return (
            <React.Fragment key={el.id}>
              <Text
                {...commonProps}
                visible={!isEditing}
                // ... باقي كود النص عندك شغال
              />
              {selectedId === el.id && (
                <ResizableShape
                  shapeRef={shapeRef}
                  isSelected
                  type="text"
                  onTransformEnd={(newProps) =>
                    handleUpdateShape(el.id, newProps, setElements)
                  }
                />
              )}
            </React.Fragment>
          );
        }

        // الأشكال
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
                    onTransformEnd={(newProps) =>
                      handleUpdateShape(el.id, newProps, setElements)
                    }
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
                    onTransformEnd={(newProps) =>
                      handleUpdateShape(el.id, newProps, setElements)
                    }
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
                    ctx.fillStyle = el.fill;
                    ctx.fill();
                    ctx.strokeShape(shape);
                  }}
                />
                {selectedId === el.id && (
                  <ResizableShape
                    shapeRef={shapeRef}
                    isSelected
                    type="triangle"
                    onTransformEnd={(newProps) =>
                      handleUpdateShape(el.id, newProps, setElements)
                    }
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
                onTransformEnd={(id, newProps) =>
                  handleUpdateShape(id, newProps, setElements)
                }
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
