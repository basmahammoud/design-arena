import axios from 'axios';

export const exportDesignToFigma = async (designId) => {
  const response = await axios.get(`http://localhost:8000/figma-launch/${designId}`);
  
  const { figma_url, design_data_url } = response.data;
  
  // افتح المشروع في Figma
  window.open(figma_url, '_blank');
  
  // انسخ الرابط لاستخدامه داخل البلاغن لاحقًا
  return { design_data_url };
};

