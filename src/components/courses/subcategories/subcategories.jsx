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
<div className='subcategory-countainer'>
  <div className="left-panel">
    {/* <img   src={h}
     alt="Logo" className="panel-image" /> */}
  </div>  <div className='subcategory-list'>
    {subcategories.map((sub) => (
      <div 
        className='subcategory' 
        key={sub.id}
        onClick={() => handleClick(sub)}
      >
        <div className='left'>
          <img src={work} alt={sub.name} className='avatar' />
          <div className='info'>
            <h3>{sub.name}</h3>
            <p>Paid: {sub.type === 0 ? 'No' : 'Yes'}</p>
          </div>
        </div>
        <div className='arrow'>➔</div>
      </div>
    ))}
  </div>
</div>


  );
};

export default Subcategories;
