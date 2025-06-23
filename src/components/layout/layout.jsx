import React from "react";
import Appbar from "../Appbar/Appbar";
import "../layout/layout.css";
import { useLocation } from "react-router-dom";
import AnimationBackground from "../animation/animation";
// import ParticlesBackground from "../particles/particles";

const Layout = ({ children }) => {
  const location = useLocation();

  if (location.pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="layout-wrapper">
      {/* <AnimationBackground /> */}
      <div className="layout-content">
        <Appbar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
