// hooks/useSavedVideos.js
import { useEffect, useState } from 'react';
import { getSavedVideos, saveVideo, unsaveVideo } from '../services/videoserv';

const useSavedVideos = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const videos = await getSavedVideos();
      console.log('Fetched saved videos:', videos); // ✅ تحقق من شكل البيانات هنا
          setSavedVideos(Array.isArray(videos.videos) ? videos.videos : []);
    } catch (err) {
      console.error('Error fetching saved videos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const toggleSave = async (videoId) => {
    try {
      const isAlreadySaved = savedVideos.some(video => video.id === videoId);
      if (isAlreadySaved) {
        await unsaveVideo(videoId);
        setSavedVideos(prev => prev.filter(video => video.id !== videoId));
      } else {
        const newVideo = await saveVideo(videoId);
        setSavedVideos(prev => [...prev, newVideo]);
      }
    } catch (error) {
      console.error('Error toggling save', error);
    }
  };

  return {
    savedVideos,
    toggleSave,
    isSaved: (id) => savedVideos.some(video => video.id === id),
    loading
  };
};

export default useSavedVideos;
