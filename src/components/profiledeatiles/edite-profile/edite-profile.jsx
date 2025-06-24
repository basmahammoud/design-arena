import React, { useState } from 'react';
import useProfile from '../../../hooks/profilehooks';
import ProfileEditDialog from '../../dialog/edite-dialog';
// import './edite-profile.css';

const Edite_profile = () => {
  const { user, loading, refetch } = useProfile(); 
  if (loading) return <p>جاري التحميل...</p>;
  if (!user) return <p>لم يتم العثور على بيانات.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <ProfileEditDialog user={user} onProfileUpdated={refetch} />
    </div>
  );
};

export default Edite_profile;
