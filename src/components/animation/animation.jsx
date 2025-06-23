import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../assets/bg-animation.json';
import './animation.css';

const AnimationBackground = () => {
  return (
    <div className="animation-background">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="full-screen-animation"
      />
    </div>
  );
};

export default AnimationBackground;
