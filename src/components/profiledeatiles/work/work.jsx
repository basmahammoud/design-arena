import React, { useState } from 'react';
import './work.css';
import useUserDesigns from '../../../hooks/useviewdesign';
import useExportToFigma from '../../../hooks/usefigma';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import useUpdateDesign from '../../../hooks/useUpdateDesign';
import EditDesignModal from '../../models/edit-design/edit-design';
import { useTranslation } from "react-i18next";

const MyDesign = ({ user, refetchProfile }) => {
  const { handleUpdateDesign } = useUpdateDesign();
  const userId = user?.id;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { designs, loading, error } = useUserDesigns(userId);
  const { exportToFigma, loading: exportLoading, error: exportError } = useExportToFigma();

  const [selectedDesign, setSelectedDesign] = useState(null);

  const handleSave = async ({ name, json_data }) => {
    try {
      let imagePaths = [];
      try {
        imagePaths = JSON.parse(selectedDesign.image_path || '[]');
      } catch (e) {
        console.error('فشل في تحويل image_path إلى JSON:', e);
      }

      const imageUrl = imagePaths.length > 0 ? `http://localhost:8000/${imagePaths[0]}` : null;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];

        await handleUpdateDesign(selectedDesign.id, {
          name,
          json_data,
          image_base64: [base64],
        });

        alert('تم الحفظ بنجاح');
        setSelectedDesign(null);

        //  إعادة تحميل الملف الشخصي لعرض التغييرات مباشرة
        if (refetchProfile) {
          refetchProfile();
        }
      };
    } catch (err) {
      console.error('خطأ أثناء الحفظ:', err);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  if (!userId) {
    return <p>جاري تحميل الملف الشخصي...</p>;
  }

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
          {designs.map((design) => (
            <div className="work-item" key={design.id}>
         {(() => {
  let imagePaths = [];
  try {
    imagePaths = JSON.parse(design.image_path || '[]');
  } catch (e) {
    console.error('فشل في تحويل image_path إلى JSON:', e);
  }

  const imageUrl = imagePaths.length > 0 ? `http://localhost:8000/${imagePaths[0]}` : null;

  // اقرأ النوع من meta_data
let parsedMeta = {};
try {
  const parsed = typeof design.json_data === "string" 
    ? JSON.parse(design.json_data) 
    : design.json_data;

  // أول شي نقرأ page meta
  const pageMeta = parsed?.pages?.[0]?.meta_data || {};
  // بعدها نقرأ root meta
  const rootMeta = parsed?.meta_data || {};

  // لو page فيه بيانات استخدمه، لو فاضي استخدم root
  parsedMeta = Object.keys(pageMeta).length ? pageMeta : rootMeta;

  console.log("🧐 parsedMeta:", parsedMeta);

} catch (e) {
  console.error("❌ خطأ في parsing json_data:", e);
}

const type = parsedMeta.type || "web";
const width = parsedMeta.width || (type === "mobile" ? 390 : 1440);
const height = parsedMeta.height || (type === "mobile" ? 844 : 900);

console.log("📐 Final size:", { type, width, height });


  return (
    imageUrl ? (
      <img
        src={imageUrl}
        alt={design.name}
        className={`design-image ${type === "mobile" ? "mobile-preview" : "web-preview"}`}
      />
    ) : (
      <div className="no-image">لا توجد صورة</div>
    )
  );
})()}


              <div
                className="edit-work"
                onClick={() => setSelectedDesign(design)}
                title="تعديل التصميم"
              >
                <FaEdit />
              </div>

              <button
                className="figma-button"
                onClick={() => exportToFigma(design.id)}
                disabled={exportLoading}
              >
                {exportLoading ? 'جارٍ التصدير...' : 'فتح في Figma'}
              </button>
            </div>
          ))}
        </div>
      )}

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
