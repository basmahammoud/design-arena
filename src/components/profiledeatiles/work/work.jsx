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
import useFigma from "../../../hooks/usefigma";

const MyDesign = ({ user, refetchProfile }) => {
  const { handleUpdateDesign } = useUpdateDesign();
  const userId = user?.id;
  const navigate = useNavigate();
  const { t } = useTranslation();
const { exportToFigma, loading: exportLoading, error: exportError } = useFigma();
  const { designs, loading, error } = useUserDesigns(userId);

  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedPagesDesign, setSelectedPagesDesign] = useState(null);
  const { loading: updateLoading, error: updateError } = useUpdateDesign();

  const handleSave = async ({ name, json_data, image_base64 }) => {
    try {
      let finalImages = [];

      if (Array.isArray(image_base64) && image_base64.length > 0) {
        finalImages = image_base64;
      } else if (selectedDesign?.image_path) {
        const oldImages = typeof selectedDesign.image_path === 'string'
          ? JSON.parse(selectedDesign.image_path || "[]")
          : selectedDesign.image_path;
        finalImages = oldImages;
      } else {
        throw new Error("يجب وجود صورة واحدة على الأقل للتصميم");
      }

      const jsonDataString = typeof json_data === 'string'
        ? json_data
        : JSON.stringify(json_data);

      const dataToSend = {
        name: name || selectedDesign?.name || "Untitled Design",
        json_data: jsonDataString,
        image_base64: finalImages
      };

      await handleUpdateDesign(selectedDesign.id, dataToSend);
      alert("✅ تم الحفظ بنجاح");
      setSelectedDesign(null);
      if (refetchProfile) refetchProfile();

    } catch (err) {
      console.error("❌ خطأ أثناء الحفظ:", err);
      alert(updateError || "حدث خطأ أثناء الحفظ");
    }
  };

  const hasPages = (design) => {
    if (!design.json_data) return false;
    try {
      const parsed = typeof design.json_data === "string" 
        ? JSON.parse(design.json_data) 
        : design.json_data;
      return Array.isArray(parsed.pages) && parsed.pages.length > 0;
    } catch {
      return false;
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
            let imageUrl = null;
            let imagePaths = [];

            try {
              const parsed = JSON.parse(design.image_path || '[]');
              if (Array.isArray(parsed) && parsed.length > 0) {
                imagePaths = parsed.map(p => `http://localhost:8000/${p}`);
                imageUrl = imagePaths[0];
              }
            } catch {
              if (typeof design.image_path === 'string' && design.image_path.trim() !== '') {
                imageUrl = `http://localhost:8000/${design.image_path}`;
                imagePaths = [imageUrl];
              }
            }

            return (
              <div
                className="work-item"
                key={design.id}
                onClick={() => {
                  if (hasPages(design)) {
                    setSelectedPagesDesign(design);
                  } else if (imagePaths.length > 0) {
                    window.open(imagePaths[0], "_blank");
                  } else {
                    console.log("تصميم بدون صفحات وبدون صورة.");
                  }
                }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={design.name} className="design-image" />
                ) : (
                  <div className="no-image">لا توجد صورة</div>
                )}

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

               {/* ✅ زر فتح التصميم في Figma */}
                <button
                  className="figma-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    exportToFigma(design.id);
                  }}
                  disabled={exportLoading}
                >
                  {exportLoading ? "جارٍ التصدير..." : "فتح في Figma"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedPagesDesign && (
        <PagesModal
          design={selectedPagesDesign}
          onClose={() => setSelectedPagesDesign(null)}
        />
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
