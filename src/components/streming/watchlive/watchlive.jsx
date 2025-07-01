import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import "./watchlive.css"; 

const Watchlive = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
      navigate("/lives");
  };

  

  return (
    <div className="container">
      <button
        className="custom-button"
        onClick={handleClick}
      >
        watch live 
      </button>
     
    </div>
  );
};

export default Watchlive;
