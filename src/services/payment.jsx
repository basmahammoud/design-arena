import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; 

export const checkout = async (subId, urls) => {
  const response = await axios.post(`/stripe/${subId}/checkout`, {
    subcategory_id: subId,
    ...urls
  });
  return response.data;
};
