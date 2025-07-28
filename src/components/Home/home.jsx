import "./home.css";
import useHomeDesigns from "../../hooks/useHomepage";
import { useState, useEffect } from "react";
import Search from "../../components/search/search"; 
// import '../search/search.css';

const Home = () => {
  const { designs, loading, error } = useHomeDesigns();
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [filteredDesigns, setFilteredDesigns] = useState([]);

  useEffect(() => {
    // تحديث النتائج المفلترة بمجرد تحميل البيانات الأصلية
    if (designs.length > 0) {
      setFilteredDesigns(designs);
    }
  }, [designs]);

  const handleDesignClick = (design) => {
    setSelectedDesign(design);
  };

  return (
    <div className="home-container">

       
      {loading && <p>جارٍ التحميل...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="design-grid">
    {filteredDesigns.map((design) => {

let imageUrl = "/placeholder.png";
  if (Array.isArray(design.image_path) && design.image_path.length > 0) {
    imageUrl = `http://localhost:8000/${design.image_path[0]}`;
  }

  return (
    <div key={design.id} className="design-card" onClick={() => handleDesignClick(design)}>
      <img
        src={imageUrl}
        alt={design.name}
        className="design-image"
      />
      <h2 className="design-title">{design.name}</h2>
    </div>
  );
})}

      </div>

      {/* Modal لعرض بقية الصور */}
{selectedDesign && (
  <div className="modal-overlay" onClick={() => setSelectedDesign(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>{selectedDesign.name}</h2>
      <div className="modal-images">
        {(Array.isArray(selectedDesign.image_path) ? selectedDesign.image_path : []).map((img, index) => (
          <img key={index} src={`http://localhost:8000/${img}`} alt={`img-${index}`} className="modal-img" />
        ))}
      </div>
      <button onClick={() => setSelectedDesign(null)}>إغلاق</button>
    </div>
  </div>
)}

    </div>
  );
};

export default Home;
