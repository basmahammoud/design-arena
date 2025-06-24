import React from 'react';
import { FaEye } from 'react-icons/fa';
import UploadImage from '../canvas/uploadimg/uploadimage';

const EditorButtons = ({ onPreview, onReset ,onAddElement}) => (
  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
 
    <button className="back" onClick={onReset} title="استعادة الإعدادات الافتراضية">
      back
    </button>

  </div>
);

export default EditorButtons;
