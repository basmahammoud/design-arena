import React from 'react';
import { Stage, Layer,Rect } from 'react-konva';
import ShapeRenderer from '../shapeRenderer';

const CanvasStage = ({
  stageRef,
  canvasSize,
  elements,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleSelect,
  handleDragEnd,
  handleTextEdit,
  selectedElementId,
  clearSelection,
  backgroundColor,
}) => {
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      clearSelection();
    }
  };

  return (
    <Stage
      ref={stageRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="canvas-wrapper"
      onMouseDown={(e) => {
        handleStageClick(e);    
        handleMouseDown(e);     
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
          {/* ✅ مستطيل الخلفية الأبيض داخل مساحة العمل */}
        <Rect
          x={0}
          y={0}
          width={canvasSize.width}
          height={canvasSize.height}
          fill={backgroundColor}
          shadowBlur={10}
          cornerRadius={8}         
        />
        <ShapeRenderer
          elements={elements}
          handleSelect={handleSelect}
          handleDragEnd={handleDragEnd}
          handleTextEdit={handleTextEdit}
          selectedId={selectedElementId}
        />
      </Layer>
    </Stage>
  );
};

export default CanvasStage;