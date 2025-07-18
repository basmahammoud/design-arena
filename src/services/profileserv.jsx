import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; 

export const profile = async () => {
  const token = localStorage.getItem('token'); // جلب التوكن من التخزين
  try {
    const res = await axios.get('http://localhost:8000/profile', {
      headers: {
        Authorization: `Bearer ${token}`,     
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
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const updateDesign = async (designId, { json_data, 
  image_base64, 
  name = null, 
  description = null }) => {
  try {
    const formData = new FormData();
    formData.append('json_data', JSON.stringify(json_data));
    formData.append('name', name ?? '');
    formData.append('description', description ?? '');

    image_base64.forEach((base64, index) => {
      formData.append(`image_base64[${index}]`, base64);
    });

    const token = localStorage.getItem('token'); // إذا عندك توكن للحماية

    const response = await axios.post(
      `http://localhost:8000/designs/${designId}/update`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    );
  console.log("re",response);
    return response.data;
  } catch (error) {
    console.error('❌ Unexpected update error:', error.response?.data || error.message);
    throw error;
  }
};





