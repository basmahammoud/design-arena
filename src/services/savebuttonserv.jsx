import axios from 'axios';

axios.defaults.withCredentials = true;

export const saveWebDesign = async ({ pages, imageBase64, name = '' }) => {
  try {
    const jsonPayload = {
      name: name || 'Untitled Design',
      pages: Array.isArray(pages) 
        ? pages.map(p => ({
            id: p.id,
            name: p.name,
            elements: p.elements,
            backgroundColor: p.backgroundColor,
            meta_data: {
              ...p.meta_data,
              imageBase64: p.meta_data?.imageBase64 || "",
            }
          }))
        : [],
      meta_data: {
        canvasSize: { width: 1200, height: 800 },
        type: 'web',
        pagesCount: Array.isArray(pages) ? pages.length : 0,
        elementsCount: Array.isArray(pages) 
          ? pages.reduce((sum, page) => sum + (page.elements?.length || 0), 0) 
          : 0
      }
    };

    // استخدام multipart/form-data بدلاً من JSON مباشرة
    const formData = new FormData();
    formData.append("json_data", JSON.stringify(jsonPayload));
    formData.append("name", name || 'Untitled Design');

    // إضافة الصور بشكل صحيح
    if (Array.isArray(imageBase64)) {
      imageBase64.filter(Boolean).forEach((img, index) => {
        formData.append(`image_base64[${index}]`, img);
      });
    } else if (imageBase64) {
      formData.append("image_base64[0]", imageBase64);
    }

    const response = await axios.post(
      "http://localhost:8000/web-designs",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;

  } catch (error) {
    if (error.response?.status === 422) {
      console.error("🛑 Validation error:", error.response.data.errors);
      // عرض الأخطاء بشكل مفصل
      if (error.response.data.errors) {
        Object.entries(error.response.data.errors).forEach(([field, errors]) => {
          console.error(`Field ${field}:`, errors);
        });
      }
    } else {
      console.error("❌ Unexpected error:", error);
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

// اعادة استخدام التصميم
export const editAndExportDesign = async (
  designId,
  { json_data, image_base64, name = null, description = null }
) => {
  try {
    const formData = new FormData();
    formData.append("json_data", json_data || ""); 
    formData.append("name", name ?? "");
    formData.append("description", description ?? "");

    if (Array.isArray(image_base64)) {
      image_base64.forEach((img, index) => {
        formData.append(`image_base64[${index}]`, img); 
      });
    } else {
      formData.append("image_base64[0]", image_base64);
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
        responseType: "blob", 
      }
    );

    if (response.headers["content-type"].includes("application/json")) {
      const text = await response.data.text();
      const json = JSON.parse(text);
      throw new Error(json.error || "خطأ في السيرفر");
    }

    // تحميل الصورة
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "preview.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error(
      "❌ خطأ غير متوقع أثناء التعديل:",
      error.response?.data || error.message
    );
    throw error;
  }
};



