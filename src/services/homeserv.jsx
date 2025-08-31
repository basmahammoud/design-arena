import axios from 'axios';

export const viewDesigns = async () => {
  const response = await axios.get("http://localhost:8000/designs/feed");
  return response.data;
};


export const reuse = async (
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
      `http://localhost:8000/designs/${designId}/edit-export`,
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


export const uploadImage = async () => {
  const response = await axios.post("http://localhost:8000/designs/upload-image");
  return response.data;
};