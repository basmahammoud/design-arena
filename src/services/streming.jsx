import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; 

export const Lives = async () => {
  const response = await axios.get('http://localhost:8000/streams');
  console.log("er",response);
  return response.data;

};

export const getViewerToken = async (room) => {
  const response = await axios.get('http://localhost:8000/viewer-token', { room });
  return response.data; 
};