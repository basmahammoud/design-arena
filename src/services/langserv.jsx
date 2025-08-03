import axios from "axios";

export const changeLanguageOnServer = async (lang) => {
  try {
    const res = await axios.get(`http://localhost:8000/change-language/${lang}`, {
      withCredentials: true
    });
    return res.data.status === 'success';
  } catch (error) {
    console.error("Error changing language:", error);
    return false;
  }
};

