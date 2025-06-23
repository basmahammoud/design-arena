// src/services/webDesignService.js
import axios from 'axios';

// تأكد من تفعيل إرسال الكوكيز للتوثيق
axios.defaults.withCredentials = true;

export const saveWebDesign = async ({ elements, imageBase64, name = '' }) => {
  try {
  const response = await axios.post('http://localhost:8000/web-designs', {
    json_data: JSON.stringify(elements), //  مهم جداً
    image_base64: imageBase64,           //  يجب أن يبدأ بـ "data:image/png;base64,..."
    name
  });

  return response.data;

  } catch (error) {
    if (error.response?.status === 422) {
      console.error('🛑 Validation error:', error.response.data.errors);
    } else {
      console.error('❌ Unexpected error:', error);
    }
    throw error;
  }
};



//جلب تصميم معين
export const getWebDesign = async (id) => {
  const response = await axios.get(`http://localhost:8000/web-designs/${id}`);
  return response.data;
};
//جلب تصاميم الشخص
// services/designService.js
export const getDesign = async (userId) => {
  const response = await axios.get(`http://localhost:8000/designs/user/${userId}`, { withCredentials: true });
  return response.data;
};
