import React from 'react';

function rgbaString({ r, g, b, a }) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const BackgroundFillControl = ({ backgroundColor, setBackgroundColor }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    const [r, g, b] = value.match(/\w\w/g).map((c) => parseInt(c, 16));
    setBackgroundColor({ r, g, b, a: 1 });
  };

  return (
    <div className="background-fill-control">
      <label>Background Color:</label>
      <input
        type="color"
        value={rgbaToHex(backgroundColor)}
        onChange={handleChange}
      />
    </div>
  );
};

function rgbaToHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

export default BackgroundFillControl;
