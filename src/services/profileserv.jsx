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


export const updateDesign = async (designId, data) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`/designs/${designId}/update`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update design error:', error.response?.data);
    throw error;
  }
};
