import React from 'react';
import { FaEye, FaBars } from 'react-icons/fa'; 
import './Topbar.css';
import SaveButton from '../canvas/savebtn/savebtn';

const Topbar = ({ onToggleAppbar, onPreview ,elements, canvasSize, stageRef }) => {
  return (
    <div className="editor-topbar">

      {/* زر القائمة */}
      <button className="menu-toggle-btn" onClick={onToggleAppbar} title="فتح القائمة">
        <FaBars />
      </button>

      {/* زر المعاينة */}
    <div className="topbar-actions">
        <SaveButton
          elements={elements}
          canvasSize={canvasSize}
          stageRef={stageRef}
        />
        <button className="preview-btn" onClick={onPreview} title="معاينة التصميم">
          <FaEye />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
