// src/api/designRoutes.js
import axios from 'axios';

export const viewDesigns = async () => {
  const response = await axios.get("http://localhost:8000/designs/feed");
  return response.data;
};
