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

export const updateDesign = async (
  designId,
  { json_data, image_base64 = [], name = null, description = null }
) => {
  try {
    // التأكد من json_data
    if (!json_data || typeof json_data !== "object") {
      json_data = {};
    }
    if (!Array.isArray(json_data.pages)) {
      json_data.pages = [];
    }
    if (!json_data.meta_data || typeof json_data.meta_data !== "object") {
      json_data.meta_data = {};
    }

    const formData = new FormData();
    formData.append("json_data", JSON.stringify(json_data));

    if (name !== null) formData.append("name", name);
    if (description !== null) formData.append("description", description);

    // التعامل مع الصور
    if (!Array.isArray(image_base64)) image_base64 = [image_base64];
    image_base64.forEach((base64) => {
      if (base64 && base64.startsWith("data:image/")) {
        formData.append("image_base64[]", base64);
      }
    });

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

    return response.data;
  } catch (error) {
    console.error(
      "❌ Unexpected update error:",
      error.response?.data || error.message
    );
    throw error;
  }
};





