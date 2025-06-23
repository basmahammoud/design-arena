import React from 'react';
import './work.css';
import useUserDesigns from '../../../hooks/useviewdesign';
import useExportToFigma from '../../../hooks/usefigma';
import useProfile from '../../../hooks/profilehooks'; 

const MyDesign = () => {
  const { user, loading: profileLoading } = useProfile(); //  جلب بيانات المستخدم من localStorage أو API
  const userId = user?.id;

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
              <img
                src={`http://localhost:8000/${design.image_path}`}
                alt={design.name}
                className="design-image"
              />

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
