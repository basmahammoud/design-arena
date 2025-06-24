// Users.jsx
import React from 'react';
import Layout from '../../components/layout/layout';
import Categories from '../../components/courses/categories/categories';
import Coverphoto from '../../components/profiledeatiles/coverphoto/coverphoto';
import Img from '../../components/img/img';

const Courses = () => {
  return (
    <Layout>
        <Img/>
        <Categories/>
    </Layout>
  );
};

export default Courses;
