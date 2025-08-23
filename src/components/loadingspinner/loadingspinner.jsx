import React from 'react';
import './loadingspinner.css';

export default function LoadingSpinner() {
  return (
    <div className="loader-overlay">
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
}
