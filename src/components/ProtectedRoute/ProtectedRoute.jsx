import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>الرجاء تسجيل الدخول للوصول إلى هذه الصفحة</h2>
    </div>;
  }

  return children;
};

export default ProtectedRoute;
