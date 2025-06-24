import React from 'react';
import './work.css';
import useUserDesigns from '../../../hooks/useviewdesign';
import useExportToFigma from '../../../hooks/usefigma';
import useProfile from '../../../hooks/profilehooks'; 
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import useUpdateDesign from '../../../hooks/useUpdateDesign';

const MyDesign = () => {
  const { handleUpdateDesign, loading: updateLoading, error: updateError } = useUpdateDesign();
  const { user, loading: profileLoading } = useProfile();
  const userId = user?.id;
  const navigate = useNavigate();

  const { designs, loading, error } = useUserDesigns(userId);
  const { exportToFigma, loading: exportLoading, error: exportError } = useExportToFigma();

  if (profileLoading || !userId) {
    return <p>جاري تحميل الملف الشخصي...</p>;
  }

  return (
    <div className="designer-works">
      <button className="work">تصاميمي</button>
      <hr style={{ border: '0.5px solid #ccc', margin: '1rem 0' }} />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {exportError && <p style={{ color: 'red' }}>{exportError}</p>}

      {loading ? (
        <p>جاري تحميل التصاميم...</p>
      ) : (
        <div className="works-grid">
          {designs.map((design) => (
            <div className="work-item" key={design.id}>
              {/* صورة التصميم */}
              <img
                src={`http://localhost:8000/${design.image_path}`}
                alt={design.name}
                className="design-image"
              />

              {/* زر التعديل (أيقونة قلم) */}
      <div
  className="edit-work"
  onClick={async () => {
    const name = prompt('اكتب الاسم الجديد للتصميم:', design.name);
    if (!name) return;

    try {
      // 1. تحميل الصورة وتحويلها إلى base64
      const getBase64FromImageUrl = async (imageUrl) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]); // فقط base64 بدون الـ prefix
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const base64Image = await getBase64FromImageUrl(`http://localhost:8000/${design.image_path}`);

      // 2. json_data (نفترض أنه موجود داخل design.json_data)
      const jsonData = JSON.stringify(design.json_data || {});

      // 3. إرسال البيانات كاملة
      await handleUpdateDesign(design.id, {
        name,
        json_data: jsonData,
        image_base64: base64Image,
      });

      alert('تم تعديل التصميم بنجاح');
    } catch (error) {
      console.error('فشل التعديل:', error);
      alert('حدث خطأ أثناء التعديل');
    }
  }}
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
    </div>
  );
};

export default MyDesign;
