import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; 

export const profile = async () => {
  const token = localStorage.getItem('token'); // جلب التوكن من التخزين
  try {
    const res = await axios.get('/profile', {
      headers: {
        Authorization: `Bearer ${token}`,  // إضافة التوكن هنا
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const Edite_profile = async (data) => {
  try {
    const response = await axios.post('/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Profile data:", response.data);
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const updateDesign = async (designId, { name, json_data, image_base64 }) => {
  try {
    const response = await axios.post(`http://localhost:8000/designs/${designId}/update`, {
      name,
      json_data: JSON.stringify(json_data), //  هذا هو الحل المهم
      image_base64,
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 422) {
      console.error('🛑 Update design validation error:', error.response.data.errors);
    } else {
      console.error('❌ Unexpected update error:', error);
    }
    throw error;
  }
};
