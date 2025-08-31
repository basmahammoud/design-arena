import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import ShapeRenderer from '../shapeRenderer';

const CanvasStage = ({
  stageRef,
  canvasSize,
  pages,
  currentPageIndex,
  updateElements,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleSelect,
  handleDragEnd,
  handleTextEdit,
  selectedElementId,
  clearSelection,
  backgroundColor,
  scale,
  deleteSelectedElement,
}) => {
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage() || e.target.className === 'Rect') {
      clearSelection();
    }
  };

  const elements = (pages[currentPageIndex]?.elements || []).filter(Boolean);

  return (
    <Stage
      ref={stageRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="canvas-wrapper"
      scaleX={scale}
      scaleY={scale}
      x={0}
      y={0}
      draggable={false}
      onMouseDown={(e) => {
        handleStageClick(e);
        handleMouseDown(e);
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={canvasSize.width}
          height={canvasSize.height}
          fill={typeof backgroundColor === 'string' ? backgroundColor : '#ffffff'}
          shadowBlur={10}
          cornerRadius={8}
        />

              <ShapeRenderer
          elements={elements}
          handleSelect={handleSelect}
          handleDragEnd={handleDragEnd}       // مرتبط مسبقًا بـ updateElements
          handleTextEdit={handleTextEdit}     // مرتبط مسبقًا بـ updateElements
          selectedId={selectedElementId}
          onDelete={deleteSelectedElement}
          setElements={updateElements}        // الدالة الأساسية لتحديث العناصر
        />
      </Layer>
    </Stage>
  );
};

export default CanvasStage;

