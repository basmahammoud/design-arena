import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layout/layout';
import work from '../../../assets/work.png'; 
import './subcategories.css';
import useSubcategories from '../../../hooks/usesubcategory'; 

const Subcategories = () => {
  const { id } = useParams();
  const { subcategories, loading, error } = useSubcategories(id);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading subcategories.</p>;

  const handleClick = (sub) => {
    if (sub.type === 1) {
      navigate(`/payment/${sub.id}`);
    } else {
      navigate(`/subcategories/${sub.id}/videos`);
    }
  };

  return (
    <div className='category-countainer'>
      <h1>Subcategories</h1>
      <div className='category-list'>
        {subcategories.map((sub) => (
          <div 
            className='category' 
            key={sub.id} 
            onClick={() => handleClick(sub)} 
            style={{ cursor: 'pointer' }}
          >
            <img src={work} alt={sub.name} className='category-image' />
            <div className='title'>
              <h3>{sub.name}</h3>
              <p>Type: {sub.type === 0 ? 'Free' : 'Paid'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subcategories;
