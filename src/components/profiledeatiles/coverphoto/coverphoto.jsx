import React, { useState, useRef } from 'react';
import './coverphoto.css';
import defaultCover from '../../../assets/cover1.jpg';
import useProfile from '../../../hooks/profilehooks';

const Coverphoto = () => {
  const { user, loading } = useProfile();
  const [cover, setCover] = useState(null);
  const fileInputRef = useRef(null);

  const coverPhotoUrl = cover
    ? cover
    : user?.cover_photo
    ? `http://localhost:8000/storage/${user.cover_photo}`
    : null; // عرض صورة افتراضية إذا لم تكن هناك صورة

  console.log('User cover:', coverPhotoUrl);

  return (
    <div className="cover-container">
      <img
        src={coverPhotoUrl}
        alt="Cover"
        className="cover-image"
      />
    </div>
  );
};

export default Coverphoto;
