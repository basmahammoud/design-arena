import React, { useState, useEffect } from 'react';
import './profilephoto.css';
import pro from '../../../assets/pro.jpg';
import ImageModal from '../../models/imgmodel';

const Profilephoto = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [profileSrc, setProfileSrc] = useState(null);

  useEffect(() => {
    if (user?.profile_picture) {
      setProfileSrc(`http://localhost:8000/storage/${user.profile_picture}`);
    } else {
      setProfileSrc(pro);
    }
  }, [user?.profile_picture]); //  تحديث الصورة عند تغيّرها

  const handleImageClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleImageChange = (newSrc) => setProfileSrc(newSrc);

  return (
    <>
      <div className='profile-header'>
        <div className="profile-image-container" onClick={handleImageClick}>
          <img src={profileSrc} alt="Profile" className="profile-image" />
        </div>
      </div>
      {showModal && (
        <ImageModal
          src={profileSrc}
          onClose={handleClose}
          onImageChange={handleImageChange}
        />
      )}
    </>
  );
};

export default Profilephoto;
