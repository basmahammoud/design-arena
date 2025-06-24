import React, { useState, useEffect } from 'react';
import './profilephoto.css';
import pro from '../../../assets/pro.jpg';
import ImageModal from '../../models/imgmodel';
import useProfile from '../../../hooks/profilehooks';

const Profilephoto = () => {
  const { user, loading } = useProfile();
  const [showModal, setShowModal] = useState(false);
  const [profileSrc, setProfileSrc] = useState(null);

  useEffect(() => {
    const src = user?.profile_picture
      ? `http://localhost:8000/storage/${user.profile_picture}`
      : null;

    console.log('User profile:', src);

    setProfileSrc(src); //  هذه هي الإضافة المهمة
  }, [user]);

  const handleImageClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleImageChange = (newSrc) => setProfileSrc(newSrc);

  if (loading) return null;

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
