import { useEffect, useState } from "react";
import { getNotifications, markAllAsRead, getNotificationById } from "../services/Notification";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();

      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      } else if (Array.isArray(data.data)) {
        setNotifications(data.data);
      } else {
        setNotifications([]); // fallback
      }
    } catch (err) {
      setError(err);
      console.error("خطأ في جلب الإشعارات:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error("خطأ في تمييز الإشعارات كمقروءة:", err);
    }
  };

  const fetchNotificationById = async (id) => {
    try {
      const data = await getNotificationById(id);
      return data;
    } catch (err) {
      console.error("خطأ في جلب إشعار محدد:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAllRead,
    fetchNotificationById,
  };
};
