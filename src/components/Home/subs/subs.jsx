import React from 'react';
import './subs.css';
import card1 from '../../../assets/card1.jpg';
import { useTranslation } from "react-i18next";

const Subscategory = ({ onCategorySelect }) => {
  const { t } = useTranslation();

  const categories1 = [
    { name: t('Design'), image: card1 },
    { name: t('Competition'), image: card1 },
  ];

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
