import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {logoutRequest}from "../../services/auth";
import useLogout from '../../hooks/uselogout';
import "./usermenu.css";

const UserMenu = ({ userImage }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
const { logout, loading } = useLogout();


  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <img
        src={userImage}
        alt="User"
        className="user-avatar"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="user-dropdown">
          <div onClick={() => navigate("/activity-log")}> activity</div>
          <div onClick={() => navigate("/savedvido")}>saved videos</div>
         <div onClick={logout}>
          {loading ? "Logging out..." : "Log out"}
        </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
