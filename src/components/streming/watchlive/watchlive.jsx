import React from "react";
import { useNavigate } from "react-router-dom";
import useLives from '../../../hooks/usewatchlives';
import "./watchlive.css";

const Watchlive = () => {
  const navigate = useNavigate();
  const { lives, loading, error } = useLives();

  const handleClick = (id) => {
    navigate(`/lives/${id}`); // ممكن تمرر id البث لتفتح بث محدد
  };

  if (loading) return <p>جاري تحميل البثوث...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      {/* دائماً أول دائرة = Start Stream */}
      <div className="live-circle" onClick={() => navigate("/lives")}>
        <img
          src="https://i.pravatar.cc/100"
          alt="Start Stream"
          className="profile-img"
        />
        <p className="circle-text">Start Stream</p>
      </div>

      {/* عرض البثوث المتاحة من API */}
      {lives.map((live) => (
        <div
          key={live.id}
          className="live-circle"
          onClick={() => handleClick(live.id)}
        >
          <img
            src={live.thumbnail ||`http://localhost:8000/storage/${live.user.profile_picture}`} 
            alt={live.title}
            className="profile-img"
          />
    <p className="circle-text">{live.user?.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Watchlive;
