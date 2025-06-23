import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; 

export const category = async () => {
  const response = await axios.get('http://localhost:8000/categories');
  console.log('categories',response);
  return response.data;

};

export const fetchSubcategories = async (id) => {
  const response = await axios.get(`http://localhost:8000/categories/${id}/subcategories`);
    console.log('subcategories response:', response.data);

  return response.data;
};

export const fetchSubvideos = async (id) => {
  const response = await axios.get(`http://localhost:8000/categories/${id}/videos`);
  console.log('videos response:', response.data);
  return response.data;
};

