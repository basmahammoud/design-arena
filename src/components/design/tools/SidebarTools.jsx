import React, { useState, useEffect, useRef } from 'react';
import './SidebarTools.css';
import { MdTextFields } from "react-icons/md";
import { TbOvalVertical, TbMinusVertical } from "react-icons/tb";
import { FaRegSquare, FaTable, FaSlash } from 'react-icons/fa';
import { BsCircle, BsTriangle, BsDashLg } from 'react-icons/bs';
import { LuRectangleHorizontal, LuPencilLine } from 'react-icons/lu';
import { PiShapesThin } from "react-icons/pi";
import { PiLineSegmentBold } from "react-icons/pi";
import UploadImage from '../canvas/uploadimg/uploadimage';
import { handleImageAdd } from '../../controller/EditorController';

const SidebarTools = ({ onAddElement, setElements, setBackgroundColor }) => {
  const [showShapes, setShowShapes] = useState(false);
  const [showLines, setShowLines] = useState(false);
  const shapesRef = useRef(null);
  const linesRef = useRef(null);

  // إغلاق القوائم عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shapesRef.current && !shapesRef.current.contains(e.target)) {
        setShowShapes(false);
      }
      if (linesRef.current && !linesRef.current.contains(e.target)) {
        setShowLines(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="main-layout">
      <div className="sidebar">
        {/* أدوات أساسية */}
        <div className="tool-group">
          <button title="نص" onClick={() => onAddElement('text')}>
            <MdTextFields />
          </button>
          <button title="جدول" onClick={() => onAddElement('table')}>
            <FaTable />
          </button>
          <button title="رسم بالقلم" onClick={() => onAddElement('draw')}>
            <LuPencilLine />
          </button>
        </div>

        {/* زر الأشكال */}
        <div className="tool-group" ref={shapesRef}>
          <button title="أشكال" onClick={() => setShowShapes(!showShapes)}>
            <PiShapesThin />
          </button>
          {showShapes && (
            <div className="popup-menu">
              <button title="مربع" onClick={() => onAddElement('square')}><FaRegSquare /></button>
              <button title="دائرة" onClick={() => onAddElement('circle')}><BsCircle /></button>
              <button title="مستطيل" onClick={() => onAddElement('rect')}><LuRectangleHorizontal /></button>
              <button title="مثلث" onClick={() => onAddElement('triangle')}><BsTriangle /></button>
              <button title="لون" onClick={() => onAddElement('color-picker')}>🖌️</button>
            </div>
          )}
        </div>

        {/* زر الخطوط */}
        <div className="tool-group" ref={linesRef}>
          <button title="خطوط" onClick={() => setShowLines(!showLines)}>
            <PiLineSegmentBold />
          </button>
          {showLines && (
            <div className="popup-menu">
              <button title="أفقي" onClick={() => onAddElement('line-horizontal')}><BsDashLg /></button>
              <button title="عمودي" onClick={() => onAddElement('line-vertical')}><TbMinusVertical /></button>
              <button title="مائل" onClick={() => onAddElement('line')}><FaSlash /></button>
            </div>
          )}
        </div>

        {/* زر لتلوين الخلفية */}
        <input
          type="color"
          title="لون الخلفية"
          onChange={(e) => setBackgroundColor(e.target.value)}
          style={{
            width: '30px',
            height: '30px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
        />

        {/* زر رفع صورة */}
        <UploadImage
          onImageAdd={(imageSrc) => handleImageAdd(imageSrc, setElements)}
        />
      </div>
    </div>
  );
};

export default SidebarTools;
