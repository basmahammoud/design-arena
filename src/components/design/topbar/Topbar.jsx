import React from 'react';
import { FaEye, FaBars, FaTrophy, FaPlus, FaTrash } from 'react-icons/fa'; 
import './Topbar.css';
import SaveButton from '../canvas/savebtn/savebtn';
import Streaming from '../../streming/stream/stream';
import useJoinCompetition from '../../../hooks/usejoincompetition';

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
  deleteCurrentPage
}) => {
  const { joinCompetition, loading, error } = useJoinCompetition();

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

  // حفظ الصفحة الحالية والعناصر الحالية لاستعادتها لاحقاً
  const currentPage = currentPageIndex;
  const currentElements = elements;

  // 🔹 لوب على كل الصفحات لأخذ screenshot لكل صفحة
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    let base64 = "";

    // إذا عندك stageRef ودالة لتغيير الصفحة
    if (stageRef?.current) {
      // 👇 غير إلى الصفحة الحالية في اللوب
      setCurrentPageIndex(i); // غير إلى الصفحة الحالية
      setElements(page.elements); // ضع عناصر الصفحة الحالية

      // انتظر حتى يتم تحديث الـ Stage
      await new Promise((resolve) => setTimeout(resolve, 300));

      // تأكد من أن الـ Stage جاهز بأخذ screenshot
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

  // استعد الصفحة والعناصر الأصلية
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

  // 🔹 أضف كل صور Base64 (حتى الفارغة منها للحفاظ على الترتيب)
  imageBase64Array.forEach(img => {
    formData.append("image_base64[]", img || "");
  });

  // Debugging
  console.log("Sending pages:", formattedPages.length);
  console.log("Images count:", imageBase64Array.length);
  console.log("First image exists:", !!imageBase64Array[0]);
  console.log("Last image exists:", !!imageBase64Array[imageBase64Array.length - 1]);

  try {
    const response = await joinCompetition(competitionId, formData);
    if (response) {
      alert("تم إرسال التصميم للمسابقة بنجاح 🎉");
    }
  } catch (error) {
    console.error("❌ Error sending design:", error);
    if (error.response?.status === 422) {
      console.error("Validation errors:", error.response.data.errors);
      alert("خطأ في التحقق: " + JSON.stringify(error.response.data.errors));
    } else {
      alert("حدث خطأ أثناء إرسال التصميم للمسابقة.");
    }
  }
};





  return (
    <div className="editor-topbar">
      <button className="menu-toggle-btn" onClick={onToggleAppbar} title="فتح القائمة">
        <FaBars />
      </button>

      <div className="topbar-actions">
        {/* زر إضافة صفحة */}
        <button className="page-btn add-page" onClick={addNewPage} title="إضافة صفحة جديدة">
          <FaPlus /> 
        </button>

        {/* زر حذف صفحة */}
        <button className="page-btn delete-page" onClick={deleteCurrentPage} title="حذف الصفحة الحالية">
          <FaTrash /> 
        </button>

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

        {/* <button className="preview-btn" onClick={onPreview} title="معاينة التصميم">
          <FaEye />
        </button> */}

        <button 
          className="competition-btn" 
          onClick={handleSendToCompetition} 
          disabled={loading}
          title=" send to competition "
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
