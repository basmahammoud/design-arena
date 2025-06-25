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
      const imageUrl = `http://localhost:8000/${selectedDesign.image_path}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];

        await handleUpdateDesign(selectedDesign.id, {
          name,
          json_data,
          image_base64: base64,
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
  onEditDesign={() => {
    navigate(`/editor?type=desktop/${selectedDesign.id}`, {
      state: {
        json_data: selectedDesign.json_data,
        designId: selectedDesign.id,
      },
    });
  }}
/>

    </div>
  );
};

export default MyDesign;
