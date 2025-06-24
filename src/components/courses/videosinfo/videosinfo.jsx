import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './videosinfo.css';
import useSubvideos from '../../../hooks/usevideos'; 
import useSavedVideos from '../../../hooks/useSavedvideos';
import { FaRegBookmark, FaBookmark, FaHeart, FaRegHeart } from 'react-icons/fa'; 
import useLikes from '../../../hooks/useLike'; 

const Videosinfo = () => {
  const { id } = useParams();
  const { videos, loading, error } = useSubvideos(id);
  const { savedVideoIds, toggleSave, isSaved } = useSavedVideos();
  const [searchTerm, setSearchTerm] = useState('');
 const { likedVideoIds, toggleLike, isLiked } = useLikes();


  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>Error loading videos.</p>;

  const filteredVideos = videos.filter(video =>
    video.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="videos-container">
      <h1>Videos for Subcategory ID: {id}</h1>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="video-search-input"
        />
      </div>

      <div className="videos-list">
        {filteredVideos.length === 0 ? (
          <p>No videos match your search.</p>
        ) : (
          filteredVideos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-header">
                <h3>{video.caption}</h3>
                <div className="icons-container">
                <button 
  className={`like-icon ${isLiked(video.id) ? 'liked' : ''}`}
  onClick={() => toggleLike(video.id)}
  title={isLiked(video.id) ? "Unlike" : "Like"}
>
  {isLiked(video.id) ? <FaHeart /> : <FaRegHeart />}
</button>

                  <button 
                    className={`save-icon ${isSaved(video.id) ? 'saved' : ''}`} 
                    onClick={() => toggleSave(video.id)}
                    title={isSaved(video.id) ? "Unsave" : "Save"}
                  >
                    {isSaved(video.id) ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                  
                </div>
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
export default Videosinfo;