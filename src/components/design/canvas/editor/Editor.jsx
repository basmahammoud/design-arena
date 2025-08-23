import React, { useState, useRef,  useEffect } from 'react';
import { useNavigate, useLocation ,useParams } from 'react-router-dom';
import SidebarTools from '../../tools/SidebarTools';
import PropertiesPanel from '../../panels/propertisepanel/PropertiesPanel';
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
import useProfile from "../../../../hooks/profilehooks";
import { getWebDesign } from "../../../../services/savebuttonserv";
// import PagesBar from '../editor/pagesdesign/pagesdesign'; 
import { useSaveDesign } from '../../../../hooks/usesavedesign';
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
  const initialDesignId = location.state?.designId || null;
  const [designId, setDesignId] = useState(initialDesignId);
  const navigate = useNavigate();
  const [showAppbar, setShowAppbar] = useState(false);
  const type = new URLSearchParams(location.search).get("type");
  const storageKey = `editor-elements-${type || "default"}`;
 const { id: competitionId } = useParams();
  console.log("DesignEditor competitionId:", competitionId);
  const [canvasSize, setCanvasSize] = useState({
    width: type === "mobile" ? 390 : 1200,
    height: type === "mobile" ? 844 : 800,
  });

  const isGuest = localStorage.getItem("guest") === "true";

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

  const { saveDesign, isSaving } = useSaveDesign();

  // جلب التصميم من السيرفر عند وجود designId
  useEffect(() => {
    if (initialDesignId) {
      const fetchDesign = async () => {
        try {
          const res = await getWebDesign(initialDesignId);
          const design = res.design;
          const parsed = design.json_data;
          if (parsed && Array.isArray(parsed.pages)) {
            setPages(parsed.pages);
            setCurrentPageIndex(0);
            setElements(parsed.pages[0]?.elements || []);
            if (parsed.meta_data?.canvasSize) {
              setCanvasSize(
                type === "mobile"
                  ? { width: 390, height: 844 }
                  : { width: 1200, height: 800 }
              );
            }
            setDesignId(design.id);
          } else {
            console.warn(" التصميم موجود لكن pages غير موجودة:", parsed);
          }
        } catch (error) {
          console.error(" فشل في جلب التصميم:", error);
        }
      };
      fetchDesign();
    }
  }, [initialDesignId, setElements, type]);

  useEffect(() => {
    if (!loading && !user) {
      alert("يجب تسجيل الدخول أولاً");
      navigate("/");
    }
  }, [user, loading, navigate]);

  useDeleteElementOnKeypress(
    selectedElementId,
    setElements,
    setSelectedElementId
  );

  // تحديث عناصر الصفحة الحالية
  const updateCurrentPageElements = (updatedElements) => {
    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        elements: updatedElements,
      };
      return newPages;
    });
    setElements(updatedElements);
  };

  // تحديث خلفية الصفحة الحالية
  const setPageBackground = (color) => {
    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        backgroundColor: color,
      };
      return newPages;
    });
  };

  const handleAddElement = (type) => {
    if (type === "color-picker") return activateColorPicker();
    const id = Date.now().toString();
    const newElement = createElement(type, id);
    if (newElement) {
      if (type === "draw") setDrawElementId(id);
      updateCurrentPageElements([...elements, newElement]);
    }
  };

  //  حفظ التصميم مع snapshot
 const handleSave = async () => {
  try {
    const stage = stageRef.current.getStage();
    if (!stage) throw new Error("Stage غير موجود");

    const originalElements = [...elements];
    const originalPageIndex = currentPageIndex;

    const updatedPages = [];

    for (let idx = 0; idx < pages.length; idx++) {
      const page = pages[idx];
//وضع عناصر الصفحة الحالية ضمن الستيج
      setElements(page.elements || []);
      setCurrentPageIndex(idx);

      await new Promise(r => setTimeout(r, 50));
      stage.batchDraw?.();
//لكل صفحة snapshot
      let snapshot = stage.toDataURL({ pixelRatio: 2 });

      if (!page.elements || page.elements.length === 0) {
        const layer = stage.getLayers()[0];
        const rect = new window.Konva.Rect({
          x: 0,
          y: 0,
          width: stage.width(),
          height: stage.height(),
          fill: page.backgroundColor || '#ffffff'
        });
        layer.add(rect);
        layer.batchDraw();
        snapshot = stage.toDataURL({ pixelRatio: 2 });
        rect.destroy();
      }

      updatedPages.push({
        ...page,
        meta_data: {
          ...page.meta_data,
          imageBase64: snapshot
        }
      });
    }

    setElements(originalElements);
    setCurrentPageIndex(originalPageIndex);

    const coverImage = updatedPages[0]?.meta_data?.imageBase64 || "";

    await saveDesign({
      pages: updatedPages,
      name: "new design",
      designId,
      canvasSize,
      type: canvasSize?.width === 390 ? "mobile" : "web",
      previewImage: coverImage
    });

    alert(" تم الحفظ بنجاح مع صور مستقلة لكل صفحة");

  } catch (err) {
    console.error(" خطأ أثناء الحفظ:", err);
    alert("فشل الحفظ");
  }
};




  const goToPreview = () =>
    navigate("/preview", {
      state: {
        pages,
        canvasSize,
        scale: 1.5,
      },
    });

  const resetToDefault = () => {
    const defaultPage = {
      id: Date.now(),
      name: "صفحة 1",
      elements: defaultElements,
      backgroundColor: "#ffffff",
    };
    setPages([defaultPage]);
    setCurrentPageIndex(0);
    setElements(defaultElements);
  };

  const handleMouseDown = () => {
    if (!drawElementId) return;
    const point = stageRef.current.getStage().getPointerPosition();
    setIsDrawing(true);
    updateCurrentPageElements(
      elements.map((el) =>
        el.id === drawElementId
          ? { ...el, points: [...(el.points || []), point.x, point.y] }
          : el
      )
    );
  };

  const handleMouseMove = () => {
    if (!isDrawing || !drawElementId) return;
    const point = stageRef.current.getStage().getPointerPosition();
    updateCurrentPageElements(
      elements.map((el) =>
        el.id === drawElementId
          ? { ...el, points: [...(el.points || []), point.x, point.y] }
          : el
      )
    );
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setDrawElementId(null);
  };

  const goToPage = (idx) => {
    setCurrentPageIndex(idx);
    setElements(pages[idx].elements);
  };

  const addNewPage = () => {
    const newPage = {
      id: Date.now(),
      name: `صفحة ${pages.length + 1}`,
      elements: [],
      backgroundColor: "#ffffff",
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
    setElements([]);
  };

  const duplicateCurrentPage = () => {
    const pageToDuplicate = pages[currentPageIndex];
    const newPage = {
      ...pageToDuplicate,
      id: Date.now(),
      name: `${pageToDuplicate.name} نسخ`,
    };
    const newPages = [...pages];
    newPages.splice(currentPageIndex + 1, 0, newPage);
    setPages(newPages);
    setCurrentPageIndex(currentPageIndex + 1);
    setElements(newPage.elements);
  };

  const deleteCurrentPage = () => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, idx) => idx !== currentPageIndex);
    setPages(newPages);
    const newIndex = Math.max(0, currentPageIndex - 1);
    setCurrentPageIndex(newIndex);
    setElements(newPages[newIndex].elements);
  };

  return (
    <div className={`editor-root ${type === "mobile" ? "mobile" : "desktop"}`}>
      {!showAppbar && (
        <Topbar
          onToggleAppbar={() => setShowAppbar(true)}
          onPreview={goToPreview}
          pages={pages}
          currentPageIndex={currentPageIndex}
          canvasSize={canvasSize}
          stageRef={stageRef}
          designId={designId}
          updateCurrentPageElements={updateCurrentPageElements}
          onSave={handleSave} 
          isSaving={isSaving}
         competitionId={competitionId}
        />
      )}

      {showAppbar && <Appbar onClose={() => setShowAppbar(false)} />}

      <div className="editor-container" style={{ display: "flex" }}>
        <SidebarTools
          onAddElement={handleAddElement}
          setElements={updateCurrentPageElements}
          setBackgroundColor={setPageBackground}
        />

        <div style={{ marginLeft: "10px", flex: 1 }}>
          {/* <PagesBar
            pages={pages}
            currentPageIndex={currentPageIndex}
            goToPage={goToPage}
            addNewPage={addNewPage}
            duplicateCurrentPage={duplicateCurrentPage}
            deleteCurrentPage={deleteCurrentPage}
          /> */}

          <EditorButtons
            onPreview={goToPreview}
            onReset={resetToDefault}
            onSave={handleSave} 
            isSaving={isSaving}
          />

          <CanvasStage
            stageRef={stageRef}
            canvasSize={canvasSize}
            elements={elements}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleSelect={(id) => setSelectedElementId(id)}
            handleDragEnd={(id, pos) =>
              handleDragEnd(id, pos, updateCurrentPageElements)
            }
            handleTextEdit={(id, text) =>
              handleTextEdit(id, text, updateCurrentPageElements)
            }
            selectedElementId={selectedElementId}
            clearSelection={() => setSelectedElementId(null)}
            backgroundColor={
              pages[currentPageIndex]?.backgroundColor || "#ffffff"
            }
          />
        </div>

        <PropertiesPanel
          shapes={elements}
          onUpdateShape={(id, props) =>
            handleUpdateShape(id, props, updateCurrentPageElements)
          }
          selectedId={selectedElementId}
        />
      </div>
    </div>
  );
};

export default Editor;