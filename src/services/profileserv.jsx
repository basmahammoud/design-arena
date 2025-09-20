import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; 

export const profile = async () => {
  const token = localStorage.getItem('token'); 
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
//تعديل التصميم 
export const updateDesign = async (
  designId,
  { json_data, image_base64 = [], name = null, description = null }
) => {
  try {
    if (!json_data || typeof json_data !== "object") json_data = {};
    if (!Array.isArray(json_data.pages)) json_data.pages = [];
    if (!json_data.meta_data || typeof json_data.meta_data !== "object") json_data.meta_data = {};

    const formData = new FormData();
    formData.append("json_data", JSON.stringify(json_data));

    if (name !== null) formData.append("name", name);
    if (description !== null) formData.append("description", description);

    if (!Array.isArray(image_base64)) image_base64 = [image_base64];
    image_base64.forEach((base64) => formData.append("image_base64[]", base64));

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `http://localhost:8000/designs/${designId}/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("edite:", response);
    return response.data;

  } catch (error) {
    console.error(
      "❌ Unexpected update error:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const publicProfile = async (id) => {
  const res = await axios.get(`http://localhost:8000/users/public/${id}`);
  console.log("res",res);
  return res.data;
};



export const uploadDesignImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post('http://localhost:8000/design/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
console.log("res:",response);
  return response.data;
};
