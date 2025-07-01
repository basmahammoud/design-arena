import React, { useState, useEffect, useRef } from "react";
import { SidebarData } from "../../Data/Data";
import { useNavigate } from 'react-router-dom';
import useLogout from "../../hooks/uselogout";
import ChoseDesign from "../models/chose-design/chose-design";
import { FaBars, FaTimes } from 'react-icons/fa';
import UserMenu from "../usermenu/usermenu";
import useProfile from "../../hooks/profilehooks"; 
import './Appbar.css';
import NotificationsMenu from '../Notification/NotificationsMenu';


const Appbar = ({ onClose }) => {
  const [selected, setSelected] = useState(() => {
    const savedIndex = localStorage.getItem('selectedMenuIndex');
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const menuRefs = useRef([]);
  const [openDesignModal, setOpenDesignModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ← جديد

  const navigate = useNavigate();
  const { user, loading } = useProfile();

  const handleChoose = (type) => {
    setOpenDesignModal(false);
    navigate(`/editor?type=${type}`);
    setIsMenuOpen(false); // ← إغلاق القائمة بعد الاختيار
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false); // ← إغلاق القائمة بعد التنقل
  };

  useEffect(() => {
    const currentItem = menuRefs.current[selected];
    if (currentItem) {
      setIndicatorStyle({
        left: currentItem.offsetLeft,
        width: currentItem.offsetWidth,
      });
    }
    localStorage.setItem('selectedMenuIndex', selected);
  }, [selected]);

  return (
    <>
      <div className="Topbar">
        <div className="TopbarLogo">Digitizer</div>

   <button
  className={`menu-icon ${isMenuOpen ? 'open' : ''}`}
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  title={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
>
  <span className="icon-wrapper">
    {isMenuOpen ? <FaTimes /> : <FaBars />}
  </span>
</button>



        <div className={`TopbarMenu ${isMenuOpen ? 'show' : ''}`}>
          {SidebarData.map((item, index) => (
            <div
              className={selected === index ? 'TopbarMenuItem active' : 'TopbarMenuItem'}
              key={index}
              ref={(el) => (menuRefs.current[index] = el)}
              onClick={() => {
                setSelected(index);
                if (item.isDesignPopup) {
                  setOpenDesignModal(true);
                } else {
                  handleNavigate(item.path);
                }
              }}
            >
              <span className="item-heading">{item.heading}</span>
            </div>
          ))}

          <div
            className="TopbarIndicator"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
        </div>

        <UserMenu
          userImage={
            user?.profile_picture
              ? `http://localhost:8000/storage/${user.profile_picture}`
              : null
          }
        />
            <NotificationsMenu /> 
      </div>

        {/* Sidebar Slide Menu */}
  <div className={`SidebarOverlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)} />

  <div className={`SidebarMenu ${isMenuOpen ? 'open' : ''}`}>
    {SidebarData.map((item, index) => (
      <div
        className={selected === index ? 'SidebarMenuItem active' : 'SidebarMenuItem'}
        key={index}
        onClick={() => {
          setSelected(index);
          if (item.isDesignPopup) {
            setOpenDesignModal(true);
          } else {
            handleNavigate(item.path);
          }
        }}
      >
        <span className="item-heading">{item.heading}</span>
      </div>
    ))}
  </div>

      <ChoseDesign
        open={openDesignModal}
        handleClose={() => setOpenDesignModal(false)}
        handleChoose={handleChoose}
      />
    </>
  );
};


export default Appbar;
