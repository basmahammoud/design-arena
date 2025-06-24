import "./home.css";
import useHomeDesigns from "../../hooks/useHomepage";
import { useState } from "react";

const Home = () => {
  const { designs, loading, error } = useHomeDesigns();
  const [selectedDesign, setSelectedDesign] = useState(null);

  const handleDesignClick = (design) => {
    setSelectedDesign(design);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">معرض التصاميم</h1>

      {loading && <p>جارٍ التحميل...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="design-grid">
        {designs.map((design) => (
          <div key={design.id} className="design-card" onClick={() => handleDesignClick(design)}>
            <img
              src={design.images?.[0] || "/placeholder.png"}
              alt={design.name}
              className="design-image"
            />
            <h2 className="design-title">{design.name}</h2>
          </div>
        ))}
      </div>

      {/* Modal لعرض بقية الصور */}
      {selectedDesign && (
        <div className="modal-overlay" onClick={() => setSelectedDesign(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedDesign.name}</h2>
            <div className="modal-images">
              {selectedDesign.images.map((img, index) => (
                <img key={index} src={img} alt={`img-${index}`} className="modal-img" />
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
