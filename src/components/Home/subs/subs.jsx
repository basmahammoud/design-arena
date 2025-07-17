import React from 'react';
import './subs.css';
import card1 from '../../../assets/card1.jpg';

const categories1 = [
  { name: 'Design', image: card1 },
  { name: 'Competition', image: card1 },
];

const Subscategory = ({ onCategorySelect }) => {
  return (
    <div className="sub-container">
      {categories1.map((category, index) => (
        <div
          className="card-sub"
          key={index}
          onClick={() => onCategorySelect(category.name)}
        >
          <img src={category.image} alt={category.name} className="card-image" />
          <div className="overlay2">
            <div className="overlay-text2">{category.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Subscategory;
