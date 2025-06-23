// services/videos/savedVideosService.js
import axios from 'axios';
axios.defaults.withCredentials = true;

const API_BASE = 'http://localhost:8000/videos'; 

export const getSavedVideos = async () => {
  const res = await axios.get(`${API_BASE}/saved`);
  return res.data;
};

export const saveVideo = async (videoId) => {
  const res = await axios.post(`${API_BASE}/${videoId}/save`, {
    withCredentials: true
  });
  console.log('save response:', res.data);
  return res.data;
};

export const unsaveVideo = async (videoId) => {
  const res = await axios.delete(`${API_BASE}/${videoId}/save`, {
    data: {}
  });
  console.log('unsave response:', res.data);
  return res.data;
};

//  تابع تسجيل الإعجاب
export const likeVideo = async (videoId) => {
  const res = await axios.post(`${API_BASE}/${videoId}/like`, {}, {
    withCredentials: true
  });
  console.log('like response:', res.data);
  return res.data;
};

// تابع إلغاء الإعجاب
export const unlikeVideo = async (videoId) => {
  const res = await axios.delete(`${API_BASE}/${videoId}/like`, {
    data: {}
  });
  console.log('unlike response:', res.data);
  return res.data;
};
