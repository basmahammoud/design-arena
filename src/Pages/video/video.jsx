import React from 'react';
import Layout from '../../components/layout/layout';
import Videosinfo from '../../components/courses/videosinfo/videosinfo';
import { useParams } from 'react-router-dom';

const Video = () => {
     const { id } = useParams();
  return (
    <Layout>
        <Videosinfo/>
    </Layout>
  );
};

export default Video;
