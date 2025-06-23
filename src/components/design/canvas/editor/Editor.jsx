import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarTools from '../../tools/SidebarTools';
import PropertiesPanel from '../../panels/propertisepanel/PropertiesPanel';
import UploadImage from '../uploadimg/uploadimage';
import CanvasStage from '../satage/stage';
import EditorButtons from '../editorbuttons';
import { createElement } from '../elementsfactory';
import { useEditorState } from '../../../../hooks/useEditorState';
import { useColorPicker } from '../../../../hooks/useColorPicker';
import {
  handleUpdateShape,
  handleDragEnd,
  handleTextEdit,
} from '../../../controller/EditorController';
import useDeleteElementOnKeypress from '../../../../hooks/delete';
import Topbar from '../../topbar/Topbar';
import Appbar from '../../../Appbar/Appbar';
import './Editor.css';

const defaultElements = [
  {
    id: '1',
    type: 'text',
    x: 100,
    y: 80,
    text: 'مرحبًا بك!',
    fontSize: 26,
    fill: 'black',
    draggable: true,
  },
];

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAppbar, setShowAppbar] = useState(false);
  const type = new URLSearchParams(location.search).get('type');
  const storageKey = `editor-elements-${type || 'default'}`;
  const canvasSize = {
    width: type === 'mobile' ? 390 : 1200,
    height: type === 'mobile' ? 844 : 800,
  };

  const {
    elements,
    setElements,
    selectedElementId,
    setSelectedElementId,
    drawElementId,
    setDrawElementId,
    isDrawing,
    setIsDrawing,
    stageRef,
  } = useEditorState(defaultElements, storageKey);

  const { activate: activateColorPicker } = useColorPicker({
    stageRef,
    selectedElementId,
    setElements,
  });

  useDeleteElementOnKeypress(
    selectedElementId,
    setElements,
    setSelectedElementId
  );

  const handleAddElement = (type) => {
    if (type === 'color-picker') return activateColorPicker();
    const id = Date.now().toString();
    const newElement = createElement(type, id);
    if (newElement) {
      if (type === 'draw') setDrawElementId(id);
      setElements((prev) => [...prev, newElement]);
    }
  };

  const goToPreview = () =>
    navigate('/preview', { state: { elements, canvasSize, scale: 1.5 } });

  const resetToDefault = () => {
    setElements(defaultElements);
    localStorage.removeItem(storageKey);
  };

  const handleMouseDown = () => {
    if (!drawElementId) return;
    const point = stageRef.current.getStage().getPointerPosition();
    setIsDrawing(true);
    setElements((prev) =>
      prev.map((el) =>
        el.id === drawElementId
          ? { ...el, points: [...el.points, point.x, point.y] }
          : el
      )
    );
  };

  const handleMouseMove = () => {
    if (!isDrawing || !drawElementId) return;
    const point = stageRef.current.getStage().getPointerPosition();
    setElements((prev) =>
      prev.map((el) =>
        el.id === drawElementId
          ? { ...el, points: [...el.points, point.x, point.y] }
          : el
      )
    );
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setDrawElementId(null);
  };

  return (
<div className={`editor-root ${type === 'mobile' ? 'mobile' : 'desktop'}`}>
      {/*  إظهار الـ Topbar فقط إذا لم يكن Appbar ظاهرًا */}
      {!showAppbar && (
        <Topbar
          onToggleAppbar={() => setShowAppbar(true)}
          onPreview={goToPreview}
           elements={elements}
          canvasSize={canvasSize}
         stageRef={stageRef}
        />
      )}

      {/*  Appbar يظهر كـ overlay */}
      {showAppbar && <Appbar onClose={() => setShowAppbar(false)} />}

      <div className="editor-container" style={{ display: 'flex' }}>
        <SidebarTools 
        onAddElement={handleAddElement}
        setElements={setElements}
         />

        <div style={{ marginLeft: '10px', flex: 1 }}>
          <EditorButtons onPreview={goToPreview} onReset={resetToDefault} />
          <CanvasStage
            stageRef={stageRef}
            canvasSize={canvasSize}
            elements={elements}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleSelect={(id) => setSelectedElementId(id)}
            handleDragEnd={(id, pos) => handleDragEnd(id, pos, setElements)}
            handleTextEdit={(id, text) => handleTextEdit(id, text, setElements)}
            selectedElementId={selectedElementId}
            clearSelection={() => setSelectedElementId(null)}
          />
        </div>
        <PropertiesPanel
          shapes={elements}
          onUpdateShape={(id, props) =>
            handleUpdateShape(id, props, setElements)
          }
          selectedId={selectedElementId}
        />
      </div>

    </div>
  );
};

export default Editor;
