import React from "react";
import "./PageThumbnails.css";

const PageThumbnails = ({ pages, currentPageIndex, setCurrentPageIndex }) => {
  return (
    <div className="page-thumbnails">
      {pages.map((page, index) => (
        <div
          key={page.id}
          className={`thumbnail ${index === currentPageIndex ? "active" : ""}`}
          onClick={() => setCurrentPageIndex(index)}
        >
          <span>{index + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default PageThumbnails;
