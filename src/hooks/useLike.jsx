// hooks/useLikes.js
import { useState, useEffect } from 'react';
import { likeVideo, unlikeVideo } from '../services/videoserv';

const useLikes = () => {
  const [likedVideoIds, setLikedVideoIds] = useState([]);

  // لاحقًا يمكن جلب الإعجابات من الخادم عند التحميل
  // useEffect(() => { fetchLikedVideos(); }, []);

  const toggleLike = async (videoId) => {
    try {
      if (likedVideoIds.includes(videoId)) {
        await unlikeVideo(videoId);
        setLikedVideoIds((prev) => prev.filter((id) => id !== videoId));
      } else {
        await likeVideo(videoId);
        setLikedVideoIds((prev) => [...prev, videoId]);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const isLiked = (videoId) => likedVideoIds.includes(videoId);

  return { likedVideoIds, toggleLike, isLiked };
};

export default useLikes;
