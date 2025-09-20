import "./home.css";
import useHomeDesigns from "../../hooks/useHomepage";  
import useUploadDesign from "../../hooks/uploadDesignImage"; 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp, FaEye } from "react-icons/fa"; 

const Home = ({ designs: externalDesigns, loading: externalLoading }) => {
  const { designs: homeDesigns, loading: homeLoading, error } = useHomeDesigns(); 
  const { uploadDesign, uploading, error: uploadError, data: uploadData } = useUploadDesign();

  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const navigate = useNavigate();

  const designs = externalDesigns !== undefined ? externalDesigns : homeDesigns;
  const loading = externalLoading !== undefined ? externalLoading : homeLoading;

  useEffect(() => {
    setFilteredDesigns(designs || []);
  }, [designs]);

  const handleEditClick = (designId) => {
    localStorage.removeItem('editor-elements-desktop');
    navigate(`/editor?type=desktop/${designId}`, {
      state: { designId, fromHome: true },   
    });
  };

  const goToPortfolio = (ownerId) => {
    navigate(`/portfolio/${ownerId}`);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadDesign(file);
      console.log("Upload success:", result);
      alert("تم رفع التصميم بنجاح!");
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="home-container">
      {loading && <p>جارٍ التحميل...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && filteredDesigns.length === 0 && (
        <p>لا توجد نتائج.</p>
      )}

      <div className="design-grid">
        {filteredDesigns.map((design) => {
          let imageUrl = "/placeholder.png";

          if (design.image_path) {
            // تحويل المسار ليمكن الوصول إليه من المتصفح
            imageUrl = `http://localhost:8000/${design.image_path}`;
          }

          return (
            <div key={design.id} className="design-card">
              <img src={imageUrl} alt={design.name} className="design-image" />
              <h2 className="design-title">{design.name}</h2>

              {design.user && (
                <div
                  className="design-owner"
                  onClick={() => goToPortfolio(design.user.id)}
                >
                  <img
                    src={`/storage/${design.user.profile_picture}`}
                    alt={design.user.name}
                    className="owner-avatar"
                  />
                  <span className="owner-name">{design.user.name}</span>
                </div>
              )}

              <div className="design-stats">
                <span className="likes">
                  <FaThumbsUp /> {design.likes_count || 0}
                </span>
                <span className="views">
                  <FaEye /> {design.views_count || 0}
                </span>
              </div>

              <button
                className="edit-button"
                onClick={() => handleEditClick(design.id)}
              >
                Edit
              </button>
            </div>
          );
        })}
      </div>

      <div className="upload-section">
        {uploading && <p>جارٍ الرفع...</p>}
        {uploadError && <p style={{ color: "red" }}>خطأ بالرفع: {uploadError.message}</p>}
      </div>
    </div>
  );
};

export default Home;
