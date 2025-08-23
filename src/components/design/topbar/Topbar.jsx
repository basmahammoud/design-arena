import React from 'react';
import { FaEye, FaBars, FaTrophy } from 'react-icons/fa'; 
import './Topbar.css';
import SaveButton from '../canvas/savebtn/savebtn';
import Streaming from '../../streming/stream/stream';
import useJoinCompetition from '../../../hooks/usejoincompetition';

const Topbar = ({ 
  onToggleAppbar, 
  pages, 
  onPreview, 
  elements, 
  canvasSize, 
  stageRef, 
  designId,
  competitionId 
}) => {
  const { joinCompetition, loading, error } = useJoinCompetition();

const handleSendToCompetition = async () => {
  if (!competitionId) {
    alert("لم يتم تحديد المسابقة");
    return;
  }

  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    alert("📛 لا توجد صفحات لإرسالها");
    return;
  }

  // حساب عدد العناصر
  const elementsCount = pages.reduce(
    (sum, page) => sum + (Array.isArray(page.elements) ? page.elements.length : 0),
    0
  );

  // تجهيز الصفحات مثل الحفظ
  const formattedPages = pages.map((page, index) => ({
    id: page.id || Date.now() + index,
    name: page.name || `صفحة ${index + 1}`,
    elements: Array.isArray(page.elements) ? page.elements : [],
    backgroundColor: typeof page.backgroundColor === "number" ? page.backgroundColor : 16777215,
    meta_data: {
      ...((page.meta_data && typeof page.meta_data === "object") ? page.meta_data : {}),
      imageBase64: page.meta_data?.imageBase64 || "",
    },
  }));

  // صورة من الكانفاس base64
  const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
  const previewImage = uri.replace(/^data:image\/\w+;base64,/, "");

  // JSON النهائي
  const jsonWithMeta = {
    name: `Design_${designId}`,
    pages: formattedPages,
    meta_data: {
      canvasSize,
      type: "competition",
      pagesCount: formattedPages.length,
      elementsCount,
      previewImage
    }
  };

  // الصور المجمعة
  const imageBase64Array = formattedPages
    .map(p => p.meta_data?.imageBase64)
    .filter(Boolean);

  // إضافة صورة الغلاف أول المصفوفة
  if (previewImage) {
    imageBase64Array.unshift(previewImage);
  }

  // formData
  const formData = new FormData();
  formData.append("json_data", JSON.stringify(jsonWithMeta));
  formData.append("description", "مشاركتي في المسابقة");
  imageBase64Array.forEach(img => formData.append("image_base64[]", img));

  console.log("📦 formData to send:");
  console.log("json_data:", jsonWithMeta);
  console.log("images count:", imageBase64Array.length);

  const response = await joinCompetition(competitionId, formData);

  if (response) {
    alert("تم إرسال التصميم للمسابقة بنجاح 🎉");
  }
};


  return (
    <div className="editor-topbar">

      <button className="menu-toggle-btn" onClick={onToggleAppbar} title="فتح القائمة">
        <FaBars />
      </button>

      <div className="topbar-actions">
        <SaveButton
          pages={pages}                     
          canvasSize={canvasSize}
          stageRef={stageRef}
          designId={designId}
        />

        <button className="preview-btn" onClick={onPreview} title="معاينة التصميم">
          <FaEye />
        </button>

        <button 
          className="competition-btn" 
          onClick={handleSendToCompetition} 
          disabled={loading}
          title="إرسال إلى المسابقة"
        >
          <FaTrophy />
          {loading ? " جاري الإرسال..." : " Send to Competition"}
        </button>

        <Streaming />
      </div>
    </div>
  );
};

export default Topbar;
