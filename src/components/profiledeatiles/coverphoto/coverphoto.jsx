import React, { useState, useEffect, useRef } from 'react';
import './coverphoto.css';
import defaultCover from '../../../assets/cover1.jpg';
import useProfile from '../../../hooks/profilehooks';

const Coverphoto = ({ user }) => {
  const [cover, setCover] = useState(null);

  useEffect(() => {
    if (user?.cover_photo) {
      setCover(`http://localhost:8000/storage/${user.cover_photo}`);
    } else {
      setCover(defaultCover);
    }
  }, [user?.cover_photo]); //  التحديث عند تغيّر الصورة

  return (
    <div className="cover-container">
      <img src={cover} alt="Cover" className="cover-image" />
    </div>
  );
};

export default Coverphoto;
