// services/verifyserv.js
import axios from 'axios';

export const verify = async (credentials) => {
  try {
    const auth_token = localStorage.getItem('auth_token');  

    const response = await axios.post('http://localhost:8000/verifyemail', credentials, {
      headers: {
        Authorization: `Bearer ${auth_token}`  
      }
    });

    console.log('verify successful:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error during verification:', error);
    throw error;
  }
};
