import React, { useState } from 'react';
import Layout from '../../components/layout/layout';
import Home from '../../components/Home/home';
import Watchlive from '../../components/streming/watchlive/watchlive';
import Subscategory from '../../components/Home/subs/subs';
import Competition from '../../components/Home/competition/competition';
import Search from '../../components/search/search';
import useHomeDesigns from '../../hooks/useHomepage';
import useDesignSearch from '../../hooks/useDesignSearch';

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Design');
  const [query, setQuery] = useState('');

  const { designs, loading: designsLoading, error } = useHomeDesigns();
  const { results: searchResults, loading: searchLoading } = useDesignSearch(query);

  // نحدد التصاميم التي ستُعرض بناءً على وجود بحث
  const displayedDesigns = query ? searchResults : designs;
  const isLoading = query ? searchLoading : designsLoading;

  return (
    <Layout>
      {/* مكون البحث */}
      <Search
        onSearch={setQuery}
        containerClassName="search-container-designs"
      />

      <Watchlive />
      <Subscategory onCategorySelect={setSelectedCategory} />

      {selectedCategory === 'Design' && (
        <Home designs={displayedDesigns} loading={isLoading} />
      )}
      
      {selectedCategory === 'Competition' && <Competition />}
    </Layout>
  );
};

export default Homepage;
