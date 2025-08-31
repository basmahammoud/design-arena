import "./home.css";
import useHomeDesigns from "../../hooks/useHomepage";  
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp, FaEye } from "react-icons/fa"; 

const Home = ({ designs: externalDesigns, loading: externalLoading }) => {
  const { designs: homeDesigns, loading: homeLoading, error } = useHomeDesigns(); 

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
          if (Array.isArray(design.image_path) && design.image_path.length > 0) {
            imageUrl = `http://localhost:8000/${design.image_path[0]}`;
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

              {/* 👇 حذف editLoading واستخدام الزر فقط للتنقّل */}
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
    </div>
  );
};

export default Home;
