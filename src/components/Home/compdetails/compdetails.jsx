import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useShow from "../../../hooks/useshow";
import "./compdetails.css";
import ChoseDesign from "../../models/chose-design/chose-design"; 

const CompetitionDetails = () => {
  const { id } = useParams();
  const { competition, designs, loading, error } = useShow(id);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  if (loading) return <p>جارٍ تحميل تفاصيل المسابقة...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!competition) return <p>لم يتم العثور على المسابقة</p>;

  const handleChoose = (type) => {
    setOpenModal(false);
    navigate(`/design/${id}?type=${type}`);
  };

  return (
    <>
      <div className="competition-details">
        <h2 className="details-title">{competition.name}</h2>
        <p className="details-description">{competition.description}</p>
        <p className="details-publisher">الناشر: {competition.publisher}</p>
        <p className="details-status">
          من {competition.start_date} إلى {competition.end_date} (
          {competition.is_finished ? "منتهية" : "جارية"})
        </p>

        {!competition.is_finished && (
          <button
            className="join-btn"
            onClick={() => setOpenModal(true)} 
          >
            Join
          </button>
        )}
      </div>

      <div className="designs-section">
        {designs.length > 0 ? (
          <>
            <h3>التصاميم المشاركة</h3>
       <div className="designs-list">
  {designs.map((design) => {
    let imagePaths = [];

    try {
      // بعض الأحيان يجيك image_path كـ JSON array
      imagePaths = JSON.parse(design.image_path || "[]");
    } catch {
      // إذا ما قدر يقرأ JSON معناه string عادي
      if (design.image_path) {
        imagePaths = [design.image_path];
      }
    }

    const imageUrl = imagePaths.length > 0 
      ? `http://localhost:8000/${imagePaths[0]}` 
      : null;

    return (
      <div key={design.id} className="comp-card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={design.name || "تصميم"}
            className="design-img"
          />
        ) : (
          <div className="no-image">لا توجد صورة</div>
        )}
        <h4>{design.name || "تصميم بدون اسم"}</h4>
      </div>
    );
  })}
</div>

          </>
        ) : (
          <p className="no-designs-message">
            {competition.is_finished
              ? "لا توجد تصاميم لهذه المسابقة."
              : "سيتم عرض التصاميم عند انتهاء المسابقة."}
          </p>
        )}
      </div>

      <ChoseDesign
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleChoose={handleChoose}
      />
    </>
  );
};

export default CompetitionDetails;
