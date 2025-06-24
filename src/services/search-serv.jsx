import axios from "axios";

export const getsearch = async () => {
    const response = await axios.get(`http://localhost:8000/videos/search`);
    return response.data;
};
