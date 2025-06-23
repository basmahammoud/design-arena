import React from 'react';
import { Stage, Layer } from 'react-konva';
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