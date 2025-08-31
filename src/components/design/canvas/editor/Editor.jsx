// Editor.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import SidebarTools from '../../tools/SidebarTools';
import PropertiesPanel from '../../panels/propertisepanel/PropertiesPanel';
import CanvasStage from '../satage/stage';
import EditorButtons from '../editorbuttons';
import Topbar from '../../topbar/Topbar';
import Appbar from '../../../Appbar/Appbar';

import { useEditorState } from '../../../../hooks/useEditorState';
import { useColorPicker } from '../../../../hooks/useColorPicker';
import useDeleteElementOnKeypress from '../../../../hooks/delete';
import useProfile from "../../../../hooks/profilehooks";
import { useSaveDesign } from '../../../../hooks/usesavedesign';

import {
  updateCurrentPageElements,
  setPageBackground,
  handleAddElement,
  addNewPage,
  deleteCurrentPage,
  resetToDefault,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
} from './editorHandlers';

import {
  handleUpdateShape,
  handleDragEnd as ctrlDragEnd,
  handleTextEdit as ctrlTextEdit,
  handleDeleteElement as ctrlDelete,
} from '../../../controller/EditorControls';

import { useEditorLifecycle } from '../../../../hooks/useEditorlifecycle.jsx';
import { handleSave } from '../editor/saveHandlers.jsx';
import PageThumbnails from './PageThumbnails/PageThumbnails.jsx';
import './Editor.css';

const defaultElements = [
  {
    id: "1",
    type: "text",
    x: 100,
    y: 80,
    text: "مرحبًا بك!",
    fontSize: 26,
    fill: "black",
    draggable: true,
  },
];

const Editor = () => {
  const location = useLocation();
  const { user, loading } = useProfile();
  const navigate = useNavigate();
  const { id: competitionId } = useParams();
  const disableSave = location.state?.disableSave || false;
    const fromHome = location.state?.fromHome || false;

  const type = new URLSearchParams(location.search).get("type");
  const storageKey = `editor-elements-${type || "default"}`;
  const initialDesignId = location.state?.designId || null;

  const [designId, setDesignId] = useState(initialDesignId);
  const [showAppbar, setShowAppbar] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: type === "mobile" ? 390 : 1200,
    height: type === "mobile" ? 844 : 800,
  });

  const [pages, setPages] = useState([
    {
      id: Date.now(),
      name: "صفحة 1",
      elements: defaultElements,
      backgroundColor: "#ffffff",
    },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const {
    selectedElementId, setSelectedElementId,
    drawElementId, setDrawElementId,
    isDrawing, setIsDrawing,
    stageRef,
  } = useEditorState(defaultElements, storageKey);

  const updateElements = (updaterOrArray) => {
    setPages(prev => {
      const updated = [...prev];
      const current = updated[currentPageIndex] || { elements: [] };

      const nextElements = typeof updaterOrArray === 'function'
        ? updaterOrArray(current.elements || [])
        : updaterOrArray;

      updated[currentPageIndex] = {
        ...current,
        elements: nextElements,
      };
      return updated;
    });
  };

  const deleteSelectedElement = () => {
    ctrlDelete(selectedElementId, updateElements, setSelectedElementId);
  };

  const { activate: activateColorPicker } = useColorPicker({
    stageRef,
    selectedElementId,
    setElements: updateElements, 
  });

  const { saveDesign, isSaving } = useSaveDesign();


useEditorLifecycle({
  initialDesignId: designId,
  setPages,
  setCanvasSize,
  setDesignId,
  type,
  user,
  loading,
  navigate,
  currentPageIndex
});

  useDeleteElementOnKeypress(selectedElementId, updateElements, setSelectedElementId);

  const goToPreview = () =>
    navigate("/preview", { state: { pages, canvasSize, scale: 1.5 } });

  const elements = pages[currentPageIndex]?.elements || [];

  return (
    <div className={`editor-root ${type === "mobile" ? "mobile" : "desktop"}`}>
      {!showAppbar && (
        <Topbar
          onToggleAppbar={() => setShowAppbar(true)}
          onPreview={goToPreview}
          pages={pages}
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={setCurrentPageIndex}
          elements={elements}
          setElements={updateElements}
          canvasSize={canvasSize}
          stageRef={stageRef}
          designId={designId}
          competitionId={competitionId}
          addNewPage={() => addNewPage(setPages, updateElements, setCurrentPageIndex)}
          deleteCurrentPage={() =>
            deleteCurrentPage(pages, currentPageIndex, setPages, updateElements, setCurrentPageIndex)
          }
          disableSave={fromHome}
        />
      )}

      {showAppbar && <Appbar onClose={() => setShowAppbar(false)} />}

      <div className="editor-container" style={{ display: "flex" }}>
        <SidebarTools
          onAddElement={(t) =>
            handleAddElement(
              t,
              activateColorPicker,
              setDrawElementId,
              (el) => updateCurrentPageElements(el, setPages, updateElements, currentPageIndex),
              elements
            )
          }
          setElements={(el) =>
            updateCurrentPageElements(el, setPages, updateElements, currentPageIndex)
          }
          setBackgroundColor={(c) =>
            setPageBackground(c, setPages, currentPageIndex)
          }
        />

        <div style={{ marginLeft: "10px", flex: 1 }}>
          <EditorButtons
            onPreview={goToPreview}
            onReset={() =>
              resetToDefault(setPages, setCurrentPageIndex, updateElements, defaultElements)
            }
            onSave={() =>
              handleSave({
                pages,
                elements,
                setElements: updateElements,
                stageRef,
                setCurrentPageIndex,
                currentPageIndex,
                canvasSize,
                designId,
                saveDesign
              })
            }
            isSaving={isSaving}
          />

          <CanvasStage
            pages={pages}
            currentPageIndex={currentPageIndex}
            stageRef={stageRef}
            canvasSize={canvasSize}
            handleMouseDown={() =>
              handleMouseDown(drawElementId, stageRef, setIsDrawing, elements, updateElements)
            }
            handleMouseMove={() =>
              handleMouseMove(isDrawing, drawElementId, stageRef, elements, updateElements)
            }
            handleMouseUp={() => handleMouseUp(setIsDrawing, setDrawElementId)}
            handleSelect={(id) => setSelectedElementId(id)}
            handleDragEnd={(id, pos) => ctrlDragEnd(id, pos, updateElements)}
            handleTextEdit={(id, text) => ctrlTextEdit(id, text, updateElements)}
            selectedElementId={selectedElementId}
            clearSelection={() => setSelectedElementId(null)}
            backgroundColor={pages[currentPageIndex]?.backgroundColor || "#ffffff"}
            deleteSelectedElement={deleteSelectedElement}
            updateElements={updateElements}
            scale={1}
          />
        </div>

        <PropertiesPanel
          shapes={elements}
          onUpdateShape={(id, props) => handleUpdateShape(id, props, updateElements)}
          selectedId={selectedElementId}
        />
      </div>

      <PageThumbnails
        pages={pages}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={setCurrentPageIndex}
      />
      
    </div>
  );
};

export default Editor;
