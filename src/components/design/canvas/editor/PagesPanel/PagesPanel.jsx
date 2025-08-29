import React from "react";
import './PagesPanel.css';

const PagesPanel = ({
  pages,
  currentPageIndex,
  setCurrentPageIndex,
  addNewPage,
  duplicateCurrentPage,
  deleteCurrentPage,
}) => {
  return (
    <div className="pages-panel">
      <h3>الصفحات</h3>
      <ul className="pages-list">
        {pages.map((page, index) => (
          <li
            key={page.id}
            onClick={() => setCurrentPageIndex(index)}
            className={`page-item ${index === currentPageIndex ? "active" : ""}`}
          >
            {page.name || `صفحة ${index + 1}`}
          </li>
        ))}
      </ul>

      <div className="buttons-container">
        <button className="add-btn" onClick={addNewPage}>➕ صفحة جديدة</button>
        <button className="duplicate-btn" onClick={() => duplicateCurrentPage(currentPageIndex)}>📑 نسخ الصفحة</button>
        <button className="delete-btn" onClick={() => deleteCurrentPage(currentPageIndex)}>🗑️ حذف الصفحة</button>
      </div>
    </div>
  );
};

export default PagesPanel;
