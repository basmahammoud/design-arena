// Users.jsx
import React from 'react';
import Layout from '../../components/layout/layout';
import Profileinfo from '../../components/profiledeatiles/profileinfo/profileinfo';
import LoadingSpinner from '../../components/loadingspinner/loadingspinner';
import useProfile from '../../hooks/profilehooks'; 

const Profile = () => {
  const { loading } = useProfile();

  if (loading) {
    return <LoadingSpinner />; //  لا تعرض شيء غير اللودينغ
  }

  return (
    <Layout>
      <Profileinfo />
    </Layout>
  );
};

export default Profile;
