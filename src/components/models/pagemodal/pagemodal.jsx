import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './pagemodal.css';

const PagesModal = ({ design, onClose }) => {
  let parsedPages = [];
  try {
    const parsed = typeof design.json_data === "string"
      ? JSON.parse(design.json_data)
      : design.json_data;
    parsedPages = parsed.pages || [];
  } catch {}

  let savedImages = [];
  try {
    const parsedImages = JSON.parse(design.image_path || '[]');
    if (Array.isArray(parsedImages)) {
      savedImages = parsedImages.map(img => `http://localhost:8000/${img}`);
    } else if (typeof design.image_path === 'string' && design.image_path.trim() !== '') {
      savedImages = [`http://localhost:8000/${design.image_path}`];
    }
  } catch {
    if (typeof design.image_path === 'string' && design.image_path.trim() !== '') {
      savedImages = [`http://localhost:8000/${design.image_path}`];
    }
  }

  return (
    <div className="pages-modal">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>
          <FaTimes />
        </button>
        <h3>صفحات التصميم: {design.name}</h3>
        <div className="pages-grid">
          {parsedPages.length > 0 ? (
            parsedPages.map((page, idx) => {
              const pageImage = page.meta_data?.imageBase64 || savedImages[idx] || null;
              const type = page.meta_data?.type || "web";

              return (
                <div key={idx} className="page-preview">
                  {pageImage ? (
                    <img
                      src={pageImage}
                      alt={`Page ${idx + 1}`}
                      className={type === "mobile" ? "mobile-preview" : "web-preview"}
                    />
                  ) : (
                    <div className="no-image">لا توجد صورة</div>
                  )}
                  <span>صفحة {idx + 1}</span>
                </div>
              );
            })
          ) : savedImages.length > 0 ? (
            savedImages.map((img, idx) => (
              <div key={idx} className="page-preview">
                <img
                  src={img}
                  alt={`Page ${idx + 1}`}
                  className="web-preview"
                />
                <span>صفحة {idx + 1}</span>
              </div>
            ))
          ) : (
            <p>لا توجد صفحات محفوظة لهذا التصميم</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesModal;
