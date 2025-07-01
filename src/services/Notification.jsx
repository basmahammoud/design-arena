import axios from "axios";

export const notifications = async () => {
  const response = await axios.get('http://localhost:8000/users/notifications', {
    headers: {
      'Accept': 'application/json'
    }
  });
  return response.data;
};

