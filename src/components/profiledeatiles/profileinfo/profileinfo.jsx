import React from 'react';
import Coverphoto from '../../profiledeatiles/coverphoto/coverphoto';
import Personalinfo from '../personal_info/personal-info';
import Connect from '../connect/connectbutton';
import MyDesign from '../work/work';
import './profileinfo.css';
import Edit_profile from '../edit-profile/edit-profile';
import Profilephoto from '../profilephoto/profilephoto';
import useProfile from '../../../hooks/profilehooks'; 

const Profileinfo = () => {
  const { user, refetch, loading } = useProfile(); 

  if (loading || !user) {
    return <p>جاري تحميل الملف الشخصي...</p>;
  }

  return (
    <div className="page-container">
      <div>
   <Coverphoto user={user} refetchProfile={refetch} />
  <Profilephoto user={user} refetchProfile={refetch} />
        <Personalinfo />
        <Edit_profile />
      </div>
      <div>
        <MyDesign user={user} refetchProfile={refetch} /> 
      </div>
    </div>
  );
};

export default Profileinfo;
