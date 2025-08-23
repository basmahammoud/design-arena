import React from "react";
import './pagesdesign.css';

export default function PagesBar({
  pages,
  currentPageIndex,
  goToPage,
  addNewPage,
  duplicateCurrentPage,
  deleteCurrentPage,
}) {
  return (
    <div
      className="pages-bar"
      style={{ display: "flex", gap: 8, alignItems: "center", padding: 8 }}
    >
      {pages.map((p, idx) => (
        <button
          key={p.id}
          onClick={() => goToPage(idx)}
          className={idx === currentPageIndex ? "btn btn-active" : "btn"}
          style={{
            borderRadius: 10,
            padding: "8px 12px",
            border: idx === currentPageIndex ? "2px solid #333" : "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {p.name || `صفحة ${idx + 1}`}
        </button>
      ))}
      <button onClick={addNewPage} className="btn" style={{ borderRadius: 10, padding: "8px 12px" }}>➕ إضافة صفحة</button>
      <button onClick={duplicateCurrentPage} className="btn" style={{ borderRadius: 10, padding: "8px 12px" }}>📄 نسخ الصفحة</button>
      <button onClick={deleteCurrentPage} disabled={pages.length <= 1} className="btn" style={{ borderRadius: 10, padding: "8px 12px" }}>🗑️ حذف الصفحة</button>
    </div>
  );
}
