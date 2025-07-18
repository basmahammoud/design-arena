import axios from "axios";

export const getsearch = async () => {
    const response = await axios.get(`http://localhost:8000/videos/search`);
    return response.data;
};

// بحث عن تصميم
export const getDesignSearch = async (query) => {
  const res = await axios.get(`http://localhost:8000/designs/search?query=${query}`);
  return res.data;
};
