import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import ShapeRenderer from '../shapeRenderer';

const CanvasStage = ({
  stageRef,
  canvasSize,
  pages ,      
  setPages,          
  currentPageIndex,
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
  scale, 
  deleteSelectedElement,
}) => {
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage() || e.target.className === 'Rect') {
      clearSelection();
    }
  };
  
  return (
    <Stage
      ref={stageRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="canvas-wrapper"
      scaleX={scale}   // ✅ التكبير على X
      scaleY={scale}   // ✅ التكبير على Y
      x={0}            // ممكن تعدل لاحقاً لو تحب تعمل Center
      y={0}
      draggable={false} // منع تحريك الكانفس بالغلط
      onMouseDown={(e) => {
        handleStageClick(e);    
        handleMouseDown(e);     
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {/* ✅ خلفية الكانفس */}
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
  elements={pages[currentPageIndex]?.elements || []}   
  handleSelect={handleSelect}
  handleDragEnd={handleDragEnd}
  handleTextEdit={handleTextEdit}
  selectedId={selectedElementId}
  onDelete={deleteSelectedElement}
 setElements={(updater) => {
   setPages((prevPages) => {
     const newPages = [...prevPages];
     newPages[currentPageIndex] = {
       ...newPages[currentPageIndex],
       elements: updater(newPages[currentPageIndex].elements),
     };
     return newPages;   
    });
 }}
/>


      </Layer>
    </Stage>
  );
};

export default CanvasStage;
