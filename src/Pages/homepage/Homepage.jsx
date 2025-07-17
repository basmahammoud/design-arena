import React from 'react';
import Layout from '../../components/layout/layout';
import Home from '../../components/Home/home';
import Watchlive from '../../components/streming/watchlive/watchlive';

const Homepage = () => {
  return (
      <Layout>
       <Watchlive/>
      <Home/>
      </Layout>

  );
};

export default Homepage;
