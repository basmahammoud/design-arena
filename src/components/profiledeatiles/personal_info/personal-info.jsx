import React, { useContext } from 'react';
import './personal-info.css';
import useProfile from '../../../hooks/profilehooks';
import { AuthContext } from '../../../context/Authcontext'; // تأكد من المسار الصحيح

const Personalinfo = () => {
  // const { user: authUser } = useContext(AuthContext); //  إذا كنت تحتاج المستخدم من السياق
  const { user, loading } = useProfile(); //  المستخدم من API
  const seekingMapToText = {
    1: "Part-time",
    2: "Fulltime",
    3: "Freelancer"
  };

  if (loading || !user) return <p>جاري تحميل المستخدم...</p>; //  تأكد أن user موجود

  return (
    <div className="personal-info-container">
      <h1 className="user-name">{user.name}</h1>
      <p className="user-experience">{user.experience}</p>
      <p className="user-experience">{seekingMapToText[user.seeking] || "Unknown"}</p>
      <a href={user.figma} className="user-link" target="_blank" rel="noopener noreferrer">{user.figma}</a>
    </div>
  );
};

export default Personalinfo;
