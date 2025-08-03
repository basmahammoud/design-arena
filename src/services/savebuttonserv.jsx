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
  console.log("re",response);
  return response.data;
};
//جلب تصاميم الشخص
export const getDesign = async (userId) => {
  const response = await axios.get(`http://localhost:8000/designs/user/${userId}`, { withCredentials: true });
  return response.data;
};
//تعديل تصميم
export const editAndExportDesign = async (
  designId,
  { json_data, image_base64, name = null, description = null }
) => {
  try {
    const formData = new FormData();
    formData.append("json_data", JSON.stringify(json_data));
    formData.append("name", name ?? "");
    formData.append("description", description ?? "");

    // ✅ أضف كل عنصر من مصفوفة الصور base64
    if (Array.isArray(image_base64)) {
      image_base64.forEach((img) => {
        formData.append("image_base64[]", img);
      });
    } else {
      formData.append("image_base64[]", image_base64);
    }

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `http://localhost:8000/designs/${designId}/preview`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // 📥 ضروري إذا كنت تتعامل مع ملف سيتم تحميله من السيرفر
      }
    );

    // إذا أردت تحميل الملف مباشرة:
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "preview.png"; // أو استخرج الاسم من الهيدر إذا أردت
    document.body.appendChild(a);
    a.click();
    a.remove();

    return true;
  } catch (error) {
    console.error("❌ Unexpected update error:", error.response?.data || error.message);
    throw error;
  }
};


