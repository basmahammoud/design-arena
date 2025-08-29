import React, { useState, useEffect } from 'react';
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
  goToPage,
  addNewPage,
  duplicateCurrentPage,
  deleteCurrentPage,
  resetToDefault,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
} from './editorHandlers';
import {
  handleUpdateShape,
  handleDragEnd,
  handleTextEdit,
  handleDeleteElement,
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

  const type = new URLSearchParams(location.search).get("type");
  const storageKey = `editor-elements-${type || "default"}`;
  const initialDesignId = location.state?.designId || null;

  const [designId, setDesignId] = useState(initialDesignId);
  const [showAppbar, setShowAppbar] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: type === "mobile" ? 390 : 1200,
    height: type === "mobile" ? 844 : 800,
  });
const deleteSelectedElement = () => {
  handleDeleteElement(selectedElementId, setElements, setSelectedElementId);
};

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
    elements, setElements,
    selectedElementId, setSelectedElementId,
    drawElementId, setDrawElementId,
    isDrawing, setIsDrawing,
    stageRef,
  } = useEditorState(defaultElements, storageKey);

  const { activate: activateColorPicker } = useColorPicker({
    stageRef,
    selectedElementId,
    setElements,
  });

  const { saveDesign, isSaving } = useSaveDesign();

  // إدارة الجلب والتحقق من المستخدم
  useEditorLifecycle({
    initialDesignId,
    setPages,
    setElements,
    setCanvasSize,
    setDesignId,
    type,
    user,
    loading,
    navigate
  });

  useDeleteElementOnKeypress(selectedElementId, setElements, setSelectedElementId);

  const goToPreview = () =>
    navigate("/preview", { state: { pages, canvasSize, scale: 1.5 } });

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
  setElements={setElements}                  
  canvasSize={canvasSize}
  stageRef={stageRef}
  designId={designId}
  competitionId={competitionId}
  addNewPage={() => addNewPage(setPages, setElements, setCurrentPageIndex)}
  deleteCurrentPage={() =>
    deleteCurrentPage(pages, currentPageIndex, setPages, setElements, setCurrentPageIndex)
  }
/>


        
      )}

      {showAppbar && <Appbar onClose={() => setShowAppbar(false)} />}

      <div className="editor-container" style={{ display: "flex" }}>
  
        <SidebarTools
          onAddElement={(t) =>
            handleAddElement(t,
               activateColorPicker,
                setDrawElementId, 
               (el) => updateCurrentPageElements(el, setPages, setElements, currentPageIndex),
                 pages[currentPageIndex]?.elements || []
              )
          }
          setElements={(el) =>
            updateCurrentPageElements(el, setPages, setElements, currentPageIndex)
          }
          setBackgroundColor={(c) =>
            setPageBackground(c, setPages, currentPageIndex)
          }
        />

        <div style={{ marginLeft: "10px", flex: 1 }}>
          <EditorButtons
            onPreview={goToPreview}
            onReset={() => resetToDefault(setPages, setCurrentPageIndex, setElements, defaultElements)}
            onSave={() =>
              handleSave({
                pages, elements, setElements, stageRef,
                setCurrentPageIndex, currentPageIndex,
                canvasSize, designId, saveDesign
              })
            }
            isSaving={isSaving}
          />

          <CanvasStage
          pages={pages}                
          currentPageIndex={currentPageIndex} 
            stageRef={stageRef}
            canvasSize={canvasSize}
            elements={elements}
            handleMouseDown={() =>
              handleMouseDown(drawElementId, stageRef, setIsDrawing, elements, updateCurrentPageElements)
            }
            handleMouseMove={() =>
              handleMouseMove(isDrawing, drawElementId, stageRef, elements, updateCurrentPageElements)
            }
            handleMouseUp={() => handleMouseUp(setIsDrawing, setDrawElementId)}
            handleSelect={(id) => setSelectedElementId(id)}
            handleDragEnd={(id, pos) =>
              handleDragEnd(id, pos, (el) => updateCurrentPageElements(el, setPages, setElements, currentPageIndex))
            }
            handleTextEdit={(id, text) =>
              handleTextEdit(id, text, (el) => updateCurrentPageElements(el, setPages, setElements, currentPageIndex))
            }
            selectedElementId={selectedElementId}
            clearSelection={() => setSelectedElementId(null)}
            backgroundColor={pages[currentPageIndex]?.backgroundColor || "#ffffff"}
             deleteSelectedElement={deleteSelectedElement}
          />
        </div>
<PropertiesPanel
  shapes={pages[currentPageIndex]?.elements || []}  
  onUpdateShape={(id, props) =>
    handleUpdateShape(
      id,
      props,
      (el) => updateCurrentPageElements(el, setPages, setElements, currentPageIndex)
    )
  }
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
