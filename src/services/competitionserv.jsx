import axios from 'axios';

axios.defaults.withCredentials = true;

export const fetchCompetitions = async () => {
  const response = await axios.get('http://localhost:8000/competitions');
  console.log("er",response);
  return response.data;

};