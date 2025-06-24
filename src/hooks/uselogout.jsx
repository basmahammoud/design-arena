// src/hooks/useLogout.js
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "../services/auth";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutRequest(); // تنفيذ الطلب إلى السيرفر
      localStorage.removeItem("token"); // حذف التوكن من التخزين
      localStorage.removeItem("lastLocation"); // لو كنت تستخدمها
      navigate("/", { replace: true }); // التوجيه للصفحة الرئيسية
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { logout: handleLogout, loading };
};

export default useLogout;
