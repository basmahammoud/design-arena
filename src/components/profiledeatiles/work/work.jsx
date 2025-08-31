import React, { useState } from 'react';
import './work.css';
import useUserDesigns from '../../../hooks/useviewdesign';
import useExportToFigma from '../../../hooks/usefigma';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import useUpdateDesign from '../../../hooks/useUpdateDesign';
import EditDesignModal from '../../models/edit-design/edit-design';
import { useTranslation } from "react-i18next";
import PagesModal from '../../models/pagemodal/pagemodal';

const MyDesign = ({ user, refetchProfile }) => {
  const { handleUpdateDesign } = useUpdateDesign();
  const userId = user?.id;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { designs, loading, error } = useUserDesigns(userId);
  const { exportToFigma, loading: exportLoading, error: exportError } = useExportToFigma();

  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedPagesDesign, setSelectedPagesDesign] = useState(null);
  const {  loading: updateLoading, error: updateError } = useUpdateDesign();

const handleSave = async ({ name, json_data, image_base64 }) => {
  try {
    console.log('📤 البيانات المرسلة:', { name, json_data, image_base64 });

    let finalImages = [];

    // معالجة الصور بشكل صحيح
    if (Array.isArray(image_base64) && image_base64.length > 0) {
      finalImages = image_base64;
    } else if (selectedDesign?.image_path) {
      // التأكد من أن image_path هي مصفوفة
      const oldImages = typeof selectedDesign.image_path === 'string' 
        ? JSON.parse(selectedDesign.image_path || "[]")
        : selectedDesign.image_path;
      finalImages = oldImages;
    } else {
      throw new Error("يجب وجود صورة واحدة على الأقل للتصميم");
    }

    // التأكد من أن json_data هي string وليست object
    const jsonDataString = typeof json_data === 'string' 
      ? json_data 
      : JSON.stringify(json_data);

    const dataToSend = { 
      name: name || selectedDesign?.name || "Untitled Design", 
      json_data: jsonDataString,
      image_base64: finalImages
    };

    console.log('📤 البيانات المعدلة للمرسل:', dataToSend);
    
    await handleUpdateDesign(selectedDesign.id, dataToSend);
    alert("✅ تم الحفظ بنجاح");
    setSelectedDesign(null);
    if (refetchProfile) refetchProfile();

  } catch (err) {
    console.error("❌ خطأ أثناء الحفظ:", err);
    alert(updateError || "حدث خطأ أثناء الحفظ");
  }
};



  if (!userId) return <p>جاري تحميل الملف الشخصي...</p>;

  return (
    <div className="designer-works">
      <button className="work">{t('My Designs')}</button>
      <hr className='line' />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {exportError && <p style={{ color: 'red' }}>{exportError}</p>}

      {loading ? (
        <p>جاري تحميل التصاميم...</p>
      ) : (
        <div className="works-grid">
          {designs.map((design) => {
            let imagePaths = [];
            try {
              imagePaths = JSON.parse(design.image_path || '[]');
            } catch {}
              // console.log('design.id', design.id, 'image_path', design.image_path);

            const imageUrl = imagePaths.length > 0 ? `http://localhost:8000/${imagePaths[0]}` : null;

            return (
              <div 
                className="work-item" 
                key={design.id}
                onClick={() => setSelectedPagesDesign(design)} 
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={design.name} className="design-image" />
                ) : (
                  <div className="no-image">لا توجد صورة</div>
                )}

                {/* أيقونة تعديل التصميم */}
                <div 
                  className="edit-work" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDesign(design); 
                  }}
                  title="تعديل التصميم"
                >
                  <FaEdit />
                </div>

                {/* زر فتح التصميم في Figma */}
                <button
                  className="figma-button"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    exportToFigma(design.id);
                  }}
                  disabled={exportLoading}
                >
                  {exportLoading ? 'جارٍ التصدير...' : 'فتح في Figma'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* نافذة عرض الصفحات */}
      {selectedPagesDesign && (
        <PagesModal 
          design={selectedPagesDesign} 
          onClose={() => setSelectedPagesDesign(null)} 
        />
      )}

      {/* نافذة تعديل التصميم */}
      <EditDesignModal
        isOpen={!!selectedDesign}
        design={selectedDesign}
        onClose={() => setSelectedDesign(null)}
        onSave={handleSave}
        navigate={navigate}
      />
    </div>
  );
};

export default MyDesign;
