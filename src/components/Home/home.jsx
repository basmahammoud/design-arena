import "./home.css";
import useHomeDesigns from "../../hooks/useHomepage";  
import useEditDesign from '../../hooks/useEditdesigns'; 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { designs, loading, error } = useHomeDesigns(); 
  const { handleEdit, loading: editLoading } = useEditDesign(); 

  const [selectedDesign, setSelectedDesign] = useState(null);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (designs.length > 0) {
      setFilteredDesigns(designs);
    }
  }, [designs]);

  const handleEditClick = async (designId) => {
  const design = filteredDesigns.find((d) => d.id === designId);

  if (!design) return;

  try {
    const base64Images = await Promise.all(
      (design.image_path || []).map(async (imgPath) => {
        const res = await fetch(`http://localhost:8000/${imgPath}`);
        const blob = await res.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob); 
        });
      })
    );

    const dataToSend = {
      json_data: design.json_data || {}, 
      image_base64: base64Images,
      name: design.name || "",
      description: design.description || "",
    };

    await handleEdit(designId, dataToSend);
    navigate(`/editor/${designId}`);
  } catch (error) {
    console.error("خطأ أثناء تعديل التصميم:", error);
    alert("حدث خطأ أثناء تعديل التصميم.");
  }
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
            <div key={design.id} className="design-card">
              <img src={imageUrl} alt={design.name} className="design-image" />
              <h2 className="design-title">{design.name}</h2>
              <button
                className="edit-button"
                onClick={() => handleEditClick(design.id)}
                disabled={editLoading}
              >
                {editLoading ? "جارٍ التعديل..." : "تعديل"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedDesign && (
        <div className="modal-overlay" onClick={() => setSelectedDesign(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedDesign.name}</h2>
            <div className="modal-images">
              {(Array.isArray(selectedDesign.image_path) ? selectedDesign.image_path : []).map(
                (img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8000/${img}`}
                    alt={`img-${index}`}
                    className="modal-img"
                  />
                )
              )}
            </div>
            <button onClick={() => setSelectedDesign(null)}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
