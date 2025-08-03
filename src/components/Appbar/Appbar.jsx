import React, { useState, useEffect, useRef } from "react";
import { AppData } from "../../Data/Data";
import { useNavigate } from 'react-router-dom';
import useLogout from "../../hooks/uselogout";
import ChoseDesign from "../models/chose-design/chose-design";
import { FaBars, FaTimes } from 'react-icons/fa';
import UserMenu from "../usermenu/usermenu";
import useProfile from "../../hooks/profilehooks"; 
import './Appbar.css';
import NotificationsMenu from '../Notification/NotificationsMenu';
import useLanguage from "../../hooks/uselang";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Appbar = ({ onClose }) => {
  const { t } = useTranslation();
  const { currentLang, changeLanguage } = useLanguage();
  const [selected, setSelected] = useState(() => {
    const savedIndex = localStorage.getItem('selectedMenuIndex');
    return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
  });

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const menuRefs = useRef([]);
  const [openDesignModal, setOpenDesignModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isGuest = localStorage.getItem('guest') === 'true';

  const navigate = useNavigate();
  const { user, loading } = useProfile();

  const handleChoose = (type) => {
    setOpenDesignModal(false);
    navigate(`/editor?type=${type}`);
    setIsMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
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

  const visibleMenuItems = AppData.filter(item => {
    const requiresAuth =
      item.headingKey === "Design" || item.path === "/portfolio";
    return user || !requiresAuth;
  });

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

        <button 
          className="lang-btn"
          onClick={() => changeLanguage(currentLang === "en" ? "ar" : "en")}
          title={currentLang === "en" ? "التبديل إلى العربية" : "Switch to English"}
        >
          <FaGlobe /> {currentLang.toUpperCase()}
        </button>

        <div className={`TopbarMenu ${isMenuOpen ? 'show' : ''}`}>
          {visibleMenuItems.map((item, index) => (
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
              <span className="item-heading">{t(item.headingKey)}</span>
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

        {isGuest ? (
          <div className="signup-button" onClick={() => navigate('/')}>
            Sign up
          </div>
        ) : (
          <UserMenu
            userImage={
              user?.profile_picture
                ? `http://localhost:8000/storage/${user.profile_picture}`
                : null
            }
          />
        )}

        {!isGuest && <NotificationsMenu />}
      </div>

      {/* Sidebar Slide Menu */}
      <div className={`SidebarOverlay ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)} />

      <div className={`SidebarMenu ${isMenuOpen ? 'open' : ''}`}>
        {AppData.map((item, index) => (
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
            <span className="item-heading">{t(item.headingKey)}</span>
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
