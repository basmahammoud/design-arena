import { useState } from 'react';
import './categories.css';
import useCategories from '../../../hooks/usecourses'; 
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; 
import Search from '../../search/search';

const Categories = () => {
  const { data: categories, loading, error } = useCategories();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const handleClick = (id) => {
    navigate(`/subcategories/${id}`);
  };

  const displayedCategories = filteredCategories.length > 0 ? filteredCategories : categories;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories: {error.message}</div>;

  return (
    <div className='category-countainer'>
 <div className="search-icon-container">
  <FaSearch
    onClick={() => setShowSearch(!showSearch)}
    className="search-icon"
    title="Search"
  />
  <div className={`search-container1 ${showSearch ? 'show' : ''}`}>
    <Search
      originalCategories={categories}
      setFilteredCategories={setFilteredCategories}
    />
  </div>
</div>

      <h1>Popular courses</h1>
      <div className='category-list'>
        {displayedCategories.map((cat) => (
          <div
            className='category'
            key={cat.id}
            onClick={() => handleClick(cat.id)}
          >
            <img
              src={`http://localhost:8000/storage/${cat.image}`}
              alt={cat.name}
              className='category-image'
            />
            <div className='title'>
              <h3>{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <h1>For you</h1>
      <div className='category-list'>
        {displayedCategories.map((cat) => (
          <div className='category' key={cat.id}>
            <img
              src={`http://localhost:8000/storage/${cat.image}`}
              alt={cat.name}
              className='category-image'
            />
            <div className='title'>
              <h3>{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
