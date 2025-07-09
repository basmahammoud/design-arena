import React, { useState, useEffect } from 'react';
import './edit-design.css';

const EditDesignModal = ({ isOpen, onClose, design, onSave, navigate }) => {
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
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonData);
    } catch (e) {
      alert('⚠️ JSON غير صالح!');
      return;
    }
    parsedJson.name = name;

    onSave({ name, json_data: parsedJson }); // أرسل كـ object وليس نص
  };

  const handleEditDesign = () => {
    // 🧹 امسح البيانات القديمة من localStorage حتى لا تُحمَّل تلقائيًا
    localStorage.removeItem('editor-elements-desktop'); 
    // أو حسب الـ type الذي تستخدمه، مثلاً editor-elements-mobile لو كان التصميم موبايل

    // ✈️ انتقل للمحرر مع تمرير json_data و designId في state
    navigate(`/editor?type=desktop/${design.id}`, {
      state: {
        designId: design.id,
      },
    });
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
          <button onClick={handleEditDesign}>تعديل التصميم في المحرر</button>
          <button onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default EditDesignModal;
