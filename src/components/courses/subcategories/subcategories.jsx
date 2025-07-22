import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../layout/layout';
import './subcategories.css';
import useSubcategories from '../../../hooks/usesubcategory'; 

const Subcategories = () => {
  const { id } = useParams();
  const { subcategories, loading, error } = useSubcategories(id);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading subcategories.</p>;

  const handleClick = (sub) => {
    // if (sub.type === 1) {
    //   navigate(`/payment/${sub.id}`);
    // } else {
      navigate(`/subcategories/${sub.id}/videos`);
    //}
  };

  return (
    <div className='subcategory-countainer'>
      <div className="left-panel">
      </div>  
      <div className='subcategory-list'>
        {subcategories.map((sub) => {
          console.log('sub.image:', sub.image);

          return (
            <div 
              className='subcategory' 
              key={sub.id}
              onClick={() => handleClick(sub)}
            >
              <div className='left'>
                <img 
           src={`http://localhost:8000/storage/${sub.image}`}        
            alt={sub.name} 
                  className='avatar' 
                />
                <div className='info'>
                  <h3>{sub.name}</h3>
                  <p>price: {sub.is_paid === 0 ? 'No' : 'Yes'}</p>
                </div>
              </div>
              <div className='arrow'>➔</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subcategories;
