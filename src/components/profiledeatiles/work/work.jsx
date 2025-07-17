import React, { useState } from 'react';
import './work.css';
import useUserDesigns from '../../../hooks/useviewdesign';
import useExportToFigma from '../../../hooks/usefigma';
import useProfile from '../../../hooks/profilehooks'; 
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import useUpdateDesign from '../../../hooks/useUpdateDesign';
import EditDesignModal from '../../models/edit-design/edit-design';

const MyDesign = () => {
  const { handleUpdateDesign } = useUpdateDesign();
  const { user, loading: profileLoading } = useProfile();
  const userId = user?.id;
  const navigate = useNavigate();

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
          image_base64: [base64]
        });

        alert('تم الحفظ بنجاح');
        setSelectedDesign(null);
      };
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  if (profileLoading || !userId) {
    return <p>جاري تحميل الملف الشخصي...</p>;
  }

  return (
    <div className="designer-works">
      <button className="work">تصاميمي</button>
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

  return (
    imageUrl ? (
      <img
        src={imageUrl}
        alt={design.name}
        className="design-image"
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
