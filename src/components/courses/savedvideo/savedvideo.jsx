// components/Savedvideo.jsx
import React from 'react';
import '../videosinfo/videosinfo.css';
import useSavedVideos from '../../../hooks/useSavedvideos';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'; 

const Savedvideo = () => {
  const { savedVideos, loading, toggleSave, isSaved } = useSavedVideos();

  if (loading) return <p>Loading saved videos...</p>;

  return (
    <div className="videos-container">
      <h1>Saved Videos</h1>
      <div className="videos-list">
        {savedVideos.length === 0 ? (
          <p>No saved videos available.</p>
        ) : (
          savedVideos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-header">
                <h3>{video.caption}</h3>
                <button 
                  className={`save-icon ${isSaved(video.id) ? 'saved' : ''}`} 
                  onClick={() => toggleSave(video.id)}
                  title={isSaved(video.id) ? "Unsave" : "Save"}
                >
                  {isSaved(video.id) ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              </div>
              <p>{video.description}</p>
              {video.video_path && (
                <div>
                  <video width="320" height="240" controls>
                    <source src={`http://localhost:8000/storage/${video.video_path}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Savedvideo;
