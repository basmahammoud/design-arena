import React from 'react';
import { FaEye, FaBars, FaTrophy, FaPlus, FaTrash } from 'react-icons/fa'; 
import './Topbar.css';
import SaveButton from '../canvas/savebtn/savebtn';
import Streaming from '../../streming/stream/stream';
import useJoinCompetition from '../../../hooks/usejoincompetition';
import useRuseDesign from '../../../hooks/useRusedesigns'; 

const Topbar = ({ 
  onToggleAppbar, 
  pages, 
  onPreview, 
  elements, 
  setElements,          
  currentPageIndex,     
  setCurrentPageIndex,   
  canvasSize, 
  stageRef, 
  designId,
  competitionId,
  addNewPage,
  deleteCurrentPage,
  disableSave 
}) => {
  const { joinCompetition, loading } = useJoinCompetition();
  const { handleEdit: handlePreviewDownload, loading: previewLoading } = useRuseDesign(); // ✅ تصحيح الاستخدام

  const handleSendToCompetition = async () => {
    if (!competitionId) {
      alert("لم يتم تحديد المسابقة");
      return;
    }

    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      alert("لا توجد صفحات لإرسالها");
      return;
    }

    const elementsCount = pages.reduce(
      (sum, page) => sum + (Array.isArray(page.elements) ? page.elements.length : 0),
      0
    );

    const formattedPages = [];
    const imageBase64Array = [];

    const currentPage = currentPageIndex;
    const currentElements = elements;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      let base64 = "";

      if (stageRef?.current) {
        setCurrentPageIndex(i); 
        setElements(page.elements); 
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (stageRef.current) {
          try {
            const uri = stageRef.current.toDataURL({ 
              pixelRatio: 2,
              mimeType: 'image/png',
              quality: 0.9
            });
            base64 = uri;
          } catch (error) {
            console.error("Error taking screenshot for page", i, error);
          }
        }
      }

      imageBase64Array.push(base64);

      formattedPages.push({
        id: page.id || Date.now() + i,
        name: page.name || `صفحة ${i + 1}`,
        elements: Array.isArray(page.elements) ? page.elements : [],
        backgroundColor: typeof page.backgroundColor === "number" ? page.backgroundColor : 16777215,
        meta_data: {
          ...((page.meta_data && typeof page.meta_data === "object") ? page.meta_data : {}),
          imageBase64: base64,
        }
      });
    }

    setCurrentPageIndex(currentPage);
    setElements(currentElements);

    const previewImage = imageBase64Array[0] || "";

    const jsonWithMeta = {
      name: `Design_${designId || "Untitled"}`,
      pages: formattedPages,
      meta_data: {
        canvasSize: canvasSize || { width: 1200, height: 800 },
        type: "competition",
        pagesCount: formattedPages.length,
        elementsCount,
        previewImage
      }
    };

    const formData = new FormData();
    formData.append("json_data", JSON.stringify(jsonWithMeta));
    formData.append("description", "مشاركتي في المسابقة");
    formData.append("name", jsonWithMeta.name);

    imageBase64Array.forEach(img => {
      formData.append("image_base64[]", img || "");
    });

    try {
      const response = await joinCompetition(competitionId, formData);
      if (response) {
        alert("تم إرسال التصميم للمسابقة بنجاح 🎉");
      }
    } catch (error) {
      console.error("❌ Error sending design:", error);
      if (error.response?.status === 422) {
        alert("خطأ في التحقق: " + JSON.stringify(error.response.data.errors));
      } else {
        alert("حدث خطأ أثناء إرسال التصميم للمسابقة.");
      }
    }
  };

  const handleDownload = async () => {
    if (!designId) {
      alert("لا يوجد تصميم محدد للتنزيل");
      return;
    }

    try {
      const formattedPages = [];
      const imageBase64Array = [];

      const currentPage = currentPageIndex;
      const currentElements = elements;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        let base64 = "";

        if (stageRef?.current) {
          setCurrentPageIndex(i); 
          setElements(page.elements); 
          await new Promise((resolve) => setTimeout(resolve, 300));
          base64 = stageRef.current.toDataURL({ pixelRatio: 2 });
        }

        imageBase64Array.push(base64);
        formattedPages.push({
          ...page,
          meta_data: {
            ...(page.meta_data || {}),
            imageBase64: base64,
          }
        });
      }

      setCurrentPageIndex(currentPage);
      setElements(currentElements);

      const jsonWithMeta = {
        name: `Design_${designId}`,
        pages: formattedPages,
      };

      await handlePreviewDownload(designId, {
        json_data: JSON.stringify(jsonWithMeta),
        image_base64: imageBase64Array
      });

    } catch (err) {
      console.error("❌ خطأ أثناء التنزيل:", err);
      alert("حدث خطأ أثناء تنزيل المعاينة");
    }
  };

  return (
    <div className="editor-topbar">
      <button className="menu-toggle-btn" onClick={onToggleAppbar} title="فتح القائمة">
        <FaBars />
      </button>

      <div className="topbar-actions">
        <button className="page-btn add-page" onClick={addNewPage} title="إضافة صفحة جديدة">
          <FaPlus /> 
        </button>

        <button className="page-btn delete-page" onClick={deleteCurrentPage} title="حذف الصفحة الحالية">
          <FaTrash /> 
        </button>

        {disableSave ? (
          <button
            className='download-btn'
            onClick={handleDownload}
            disabled={previewLoading}
            title="تنزيل التصميم"
          >
            {previewLoading ? "جارِ التحميل..." : "Download"}
          </button>
        ) : (
          <SaveButton
            pages={pages}
            canvasSize={canvasSize}
            stageRef={stageRef}
            designId={designId}
            elements={elements}
            setElements={setElements}
            currentPageIndex={currentPageIndex}
            setCurrentPageIndex={setCurrentPageIndex}
          />
        )}

        <button 
          className="competition-btn" 
          onClick={handleSendToCompetition} 
          disabled={loading}
          title="send to competition"
        >
          <FaTrophy />
          {loading ? "  sending..." : " Send to Competition"}
        </button>

        <Streaming />
      </div>
    </div>
  );
};

export default Topbar;
