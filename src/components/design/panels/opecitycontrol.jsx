function OpacityControl({ opacity, onChange ,disabled }) {
  return (
    <div className="section">
      <label>Opacity</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={opacity}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
      />
      <div>{Math.round(opacity * 100)}%</div>
    </div>
  );
}

export default OpacityControl;
