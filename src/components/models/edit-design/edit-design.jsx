import React, { useState, useEffect } from 'react';
import './edit-design.css';

const EditDesignModal = ({ isOpen, onClose, design, onSave, onEditDesign }) => {
  const [name, setName] = useState('');
  const [jsonData, setJsonData] = useState('');

  //  مزامنة الحالة عند تغيير التصميم
  useEffect(() => {
    if (design) {
      setName(design.name || '');
      setJsonData(JSON.stringify(design.json_data || {}, null, 2));
    }
  }, [design]);

  if (!isOpen || !design) return null;

  const handleSubmit = () => {
    onSave({ name, json_data: jsonData });
  };

  return (
    <div className="modal">
      <div className="modal-edit">
        <h2>تعديل التصميم</h2>

        <label>اسم التصميم:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>JSON Data:</label>
        <textarea
          rows="10"
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>حفظ</button>
          <button onClick={onEditDesign}>تعديل التصميم في المحرر</button>
          <button onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default EditDesignModal;
