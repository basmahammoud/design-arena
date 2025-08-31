import React, { useContext } from 'react';
import { useParams } from "react-router-dom";
import Coverphoto from '../../profiledeatiles/coverphoto/coverphoto';
import Personalinfo from '../personal_info/personal-info';
import Connect from '../connect/connectbutton';
import MyDesign from '../work/work';
import './profileinfo.css';
import Edit_profile from '../edit-profile/edit-profile';
import Profilephoto from '../profilephoto/profilephoto';
import useProfile from '../../../hooks/profilehooks'; 
import { AuthContext } from '../../../hooks/useAuth'; 

const Profileinfo = () => {
  const { userId } = useParams();
  const { user, refetch, loading } = useProfile(userId);
  const { currentUser } = useContext(AuthContext); 

  if (loading || !user) {
    return <p>جاري تحميل الملف الشخصي...</p>;
  }

  const isOwner = currentUser && currentUser.id.toString() === userId.toString();

  return (
    <div className="page-container">
      <div>
        <Coverphoto user={user} refetchProfile={refetch} />
        <Profilephoto user={user} refetchProfile={refetch} />
        <Personalinfo user={user} isOwner={isOwner} />
        {isOwner && <Edit_profile user={user} refetchProfile={refetch} />}
        {!isOwner && <Connect user={user} />}
      </div>
      <div>
        <MyDesign user={user} refetchProfile={refetch} />
      </div>
    </div>
  );
};

export default Profileinfo;
