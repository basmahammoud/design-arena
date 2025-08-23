import React from 'react';
import './competition.css';
import useCompetitions from '../../../hooks/useCompetition';
import { useNavigate } from 'react-router-dom';

const Competition = () => {
  const { competitions, loading, error } = useCompetitions();

   const navigate = useNavigate();
   
 const handleClick = (id) => {
    navigate(`/competitions/${id}`);
  };

  return (
    <div className="competition-container">
      {loading && <p>جارٍ تحميل المسابقات...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {competitions.map((comp) => (
        <div className="competition-card" key={comp.id} 
         onClick={() => handleClick(comp.id)}
>
          <div className="competition-content">
            <h3 className="competition-title">name:{comp.name}</h3>
            <p className="competition-description">description:{comp.description}</p>
            <p className="competition-description">publisher:{comp.publisher}</p>

          </div>
        </div>
      ))}
    </div>
  );
};

export default Competition;
