import { SketchPicker } from 'react-color';
import { useState } from 'react';

function ShadowControl({ shadow, setShadow, enabled, setEnabled, update,disabled  }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (key, value) => {
    const updated = { ...shadow, [key]: value };
    setShadow(updated);
    update('shadow', updated);
  };

  return (
    <div className="section">
      <label>
        <input
          type="checkbox"
          checked={enabled}
          disabled={disabled}
          onChange={() => {
            const newEnabled = !enabled;
            setEnabled(newEnabled);
            if (!newEnabled) {
              const empty = { color: { r: 0, g: 0, b: 0, a: 0 }, offsetX: 0, offsetY: 0, blur: 0 };
              setShadow(empty);
              update('shadow', empty);
            }
          }}
        />
        Shadow
      </label>

      {enabled && (
        <>
          <div style={{ marginBottom: 8 }}>
            <label>Offset X:</label>
            <input
              type="number"
              value={shadow.offsetX}
              onChange={(e) => handleChange('offsetX', parseInt(e.target.value))}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Offset Y:</label>
            <input
              type="number"
              value={shadow.offsetY}
              onChange={(e) => handleChange('offsetY', parseInt(e.target.value))}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Blur:</label>
            <input
              type="number"
              min="0"
              value={shadow.blur}
              onChange={(e) => handleChange('blur', parseInt(e.target.value))}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className="color-preview"
              style={{
                backgroundColor: `rgba(${shadow.color.r}, ${shadow.color.g}, ${shadow.color.b}, ${shadow.color.a})`,
                border: '1px solid #ccc',
              }}
              onClick={() => setShowPicker(!showPicker)}
            />
            {showPicker && (
              <div style={{ position: 'absolute', zIndex: 10 }}>
                <SketchPicker
                  color={shadow.color}
                  onChange={(color) => {
                    handleChange('color', color.rgb);
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ShadowControl;
