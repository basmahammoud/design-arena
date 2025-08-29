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

  const { joinCompetition, loading } = useJoinCompetition();

  const handleSendToCompetition = async () => {
    if (!competitionId) {
      alert("لم يتم تحديد المسابقة");
      return;
    }
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      alert("📛 لا توجد صفحات لإرسالها");
      return;
    }

    // .. (الكود اللي عندك لإرسال للمسابقة بدون تغيير)
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
  setElements={setElements}               // ✅ مرّرها
  currentPageIndex={currentPageIndex}
  setCurrentPageIndex={setCurrentPageIndex}  // ✅ مرّرها
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
