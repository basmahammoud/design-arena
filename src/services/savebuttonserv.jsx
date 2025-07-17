// src/services/webDesignService.js
import axios from 'axios';

// تأكد من تفعيل إرسال الكوكيز للتوثيق
axios.defaults.withCredentials = true;

export const saveWebDesign = async ({ elements, imageBase64, name = '' }) => {
  try {
    const jsonPayload = {
      name: name || 'Untitled Design',
      meta_data: [], // تقدر تبني بيانات حقيقية لو عندك
      pages: [
        {
          backgroundColor: 16777215, // مثال لون أبيض
          meta_data: [], // تقدر تضيف بيانات هنا
          elements: elements
        }
      ]
    };

    const response = await axios.post('http://localhost:8000/web-designs', {
      json_data: JSON.stringify(jsonPayload),
      image_base64: Array.isArray(imageBase64) ? imageBase64 : [imageBase64],
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
export const getDesign = async (userId) => {
  const response = await axios.get(`http://localhost:8000/designs/user/${userId}`, { withCredentials: true });
  return response.data;
};
