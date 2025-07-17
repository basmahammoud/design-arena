import React from 'react';
import Coverphoto from '../../profiledeatiles/coverphoto/coverphoto';
import Personalinfo from '../personal_info/personal-info';
import Connect from '../connect/connectbutton';
import MyDesign from '../work/work';
import './profileinfo.css';
import Edit_profile from '../edit-profile/edit-profile';
import Profilephoto from '../profilephoto/profilephoto';

const Profileinfo = () => {
  return (
    <div className="page-container">

      <div >
        <Coverphoto />
        <Profilephoto />
        <Personalinfo />
        <Edit_profile />
      </div>
      <div>
        <MyDesign />
      </div>

    </div>
  );
};



export default Profileinfo;
