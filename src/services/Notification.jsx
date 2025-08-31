import axios from "axios";

const API_URL = "http://localhost:8000/notifications";

export const getNotifications = async () => {
  const response = await axios.get(API_URL, {
    headers: { Accept: "application/json" },
  });
  return response.data; 
};

export const markAllAsRead = async () => {
  const response = await axios.post(`${API_URL}/mark-all-read`, {}, {
    headers: { Accept: "application/json" },
  });
  return response.data;
};

export const getNotificationById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Accept: "application/json" },
  });
  return response.data;
};
