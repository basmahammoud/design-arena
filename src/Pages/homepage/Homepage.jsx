import React, { useState } from 'react';
import Layout from '../../components/layout/layout';
import Home from '../../components/Home/home';
import Watchlive from '../../components/streming/watchlive/watchlive';
import Subscategory from '../../components/Home/subs/subs';
import Competition from '../../components/Home/competition/competition';
import Search from '../../components/search/search';
import useHomeDesigns from '../../hooks/useHomepage';

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Design'); // << هنا التغيير
  const { designs, loading, error } = useHomeDesigns();
  const [filteredDesigns, setFilteredDesigns] = useState([]);

  return (
    <Layout>
      {/* مكون البحث */}
      <Search
        originalCategories={designs}
        setFilteredCategories={setFilteredDesigns}
        containerClassName="search-container-designs"
      />
      <Watchlive />
      <Subscategory onCategorySelect={setSelectedCategory} />
      
      {selectedCategory === 'Design' && <Home />}
      {selectedCategory === 'Competition' && <Competition />}
    </Layout>
  );
};

export default Homepage;
