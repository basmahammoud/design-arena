import React, { useState, useRef } from 'react';
import './img.css';
import defaultCover from '../../assets/design.png';

const Img = () => {
  
  return (
    <div className="cover-container">
      <img
        src={defaultCover}
        className="cover-image"
      />
    </div>
  );
};

export default Img;
