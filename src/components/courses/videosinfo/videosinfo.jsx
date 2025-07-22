import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './videosinfo.css';
import useSubvideos from '../../../hooks/usevideos'; 
import useSavedVideos from '../../../hooks/useSavedvideos';
import { FaRegBookmark, FaBookmark, FaHeart, FaRegHeart, FaLock } from 'react-icons/fa'; 
import useLikes from '../../../hooks/useLike'; 

const Videosinfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { sub, videos, loading, error, hasAccess } = useSubvideos(id);
  const { toggleSave, isSaved } = useSavedVideos();
  const { toggleLike, isLiked } = useLikes();

  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div className="loading-message">Loading videos...</div>;
  if (error) return <div className="error-message">Error loading videos.</div>;

  const filteredVideos = videos.filter(video =>
    video.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePaymentRedirect = () => {
    navigate(`/payment/${id}`);
  };

  const handleVideoClick = (e, videoId) => {
    // منع الانتقال إذا كان الكورس مدفوع وغير مدفوع
    if (Number(sub?.is_paid) === 1 && !hasAccess) {
      e.preventDefault();
      handlePaymentRedirect();
    }
  };

  const isCourseLocked = Number(sub?.is_paid) === 1 && !hasAccess;

  return (
    <div className="videos-container">
      <h1>{sub?.name || 'Videos'}</h1>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="video-search-input"
        />
      </div>

      {isCourseLocked && (
        <div className="payment-banner">
          <div className="payment-content">
            <FaLock className="lock-icon" />
            <div className="payment-text">
              <h3>Premium Course Locked</h3>
              <p>Pay once to unlock all videos in this course</p>
            </div>
            <button 
              onClick={handlePaymentRedirect}
              className="payment-button"
            >
              Unlock for ${sub?.price || 'XX'}
            </button>
          </div>
        </div>
      )}

      <div className="videos-list">
        {filteredVideos.length === 0 ? (
          <p className="no-videos-message">No videos match your search.</p>
        ) : (
          filteredVideos.map((video) => (
            <div 
              key={video.id} 
              className={`video-card ${isCourseLocked ? 'locked' : ''}`}
              onClick={(e) => handleVideoClick(e, video.id)}
            >
              <div className="video-header">
                <h3>{video.caption}</h3>
                <div className="icons-container">
                  <button 
                    className={`icon-button ${isLiked(video.id) ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(video.id);
                    }}
                    disabled={isCourseLocked}
                  >
                    {isLiked(video.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button 
                    className={`icon-button ${isSaved(video.id) ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(video.id);
                    }}
                    disabled={isCourseLocked}
                  >
                    {isSaved(video.id) ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                </div>
              </div>
              
              <p className="video-description">{video.description}</p>

              {isCourseLocked ? (
                <div className="video-locked-overlay">
                  <FaLock className="overlay-icon" />
                  <span>Click to unlock this course</span>
                </div>
              ) : video.video_path ? (
                <div className="video-player-wrapper">
                  <video controls onClick={(e) => e.stopPropagation()}>
                    <source src={`http://localhost:8000/storage/${video.video_path}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="video-placeholder">
                  Video content not available
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Videosinfo;