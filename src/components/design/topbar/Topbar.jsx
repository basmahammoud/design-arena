import React from 'react';
import { FaEye, FaBars } from 'react-icons/fa'; 
import './Topbar.css';
import SaveButton from '../canvas/savebtn/savebtn';
import Streaming from '../../streming/stream/stream';

const Topbar = ({ onToggleAppbar, onPreview ,elements, canvasSize, stageRef ,designId}) => {
  return (
    <div className="editor-topbar">

      {/* زر القائمة */}
      <button className="menu-toggle-btn" onClick={onToggleAppbar} title="فتح القائمة">
        <FaBars />
      </button>

      {/* زر الحفظ */}
    <div className="topbar-actions">
        <SaveButton
          elements={elements}
          canvasSize={canvasSize}
          stageRef={stageRef}
          designId={designId}
        />
        <button className="preview-btn" onClick={onPreview} title="معاينة التصميم">
          <FaEye />
        </button>
     <Streaming />
      </div>
    </div>
  );
};

export default Topbar;
