// src/servicse/auth.js
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; 

export const loginRequest = async (credentials) => {
  try {
    
    await axios.get('/sanctum/csrf-cookie');

    const response = await axios.post('/login', credentials);

    console.log('Login successful:', response.data);
    return response.data;

  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


export const registerRequest = async (credentials) => {
  const response = await axios.post('http://localhost:8000/register', credentials);
  
  const auth_token = response.data.token;
  if (auth_token) {
    localStorage.setItem('auth_token', auth_token);
    console.log("auth_token",auth_token)
  }

  return response.data;
};

export const logoutRequest = async (credentials) => {
  try {
    
    await axios.get('/sanctum/csrf-cookie');

    const response = await axios.post('/logout', credentials);

    console.log('logout successful:', response.data);
    return response.data;

  } catch (error) {
    console.error('logout error:', error);
    throw error;
  }
};

  