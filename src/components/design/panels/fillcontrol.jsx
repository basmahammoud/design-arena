import { SketchPicker } from 'react-color';
import { useState } from 'react';
import ColorPickerPopover from '../../models/color/color';


function FillControl({ fillEnabled, setFillEnabled, fill, setFill, update, disabled , stroke, setStroke, }) {
  const [showFillPicker, setShowFillPicker] = useState(false);

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

  function hexToRgba(hex, alpha = 1) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
      a: alpha,
    };
  }

  const activateEyedropper = async () => {
    if ('EyeDropper' in window) {
      const eyeDropper = new window.EyeDropper();
      try {
        const result = await eyeDropper.open();
        const rgba = hexToRgba(result.sRGBHex, fill.a);
        setFill(rgba);
        update('fill', `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`);
      } catch (err) {
        console.warn('EyeDropper canceled or failed', err);
      }
    } else {
      alert('أداة القطارة غير مدعومة في هذا المتصفح.');
    }
  };

  return (
    <div className="section">
      <label>
        <input
          type="checkbox"
          checked={fillEnabled}
          disabled={disabled}
          onChange={() => {
            const newEnabled = !fillEnabled;
            setFillEnabled(newEnabled);
            if (!newEnabled) {
              const transparent = { r: 0, g: 0, b: 0, a: 0 };
              setFill(transparent);
              update('fill', 'rgba(0,0,0,0)');
            }
          }}
        />
        Fill
      </label>

    {fillEnabled && (
  <ColorPickerPopover
    color={fill}
    onChange={(newColor) => {
      setFill(newColor);
      update(
        'fill',
        `rgba(${newColor.r},${newColor.g},${newColor.b},${newColor.a})`
      );
    }}
    showBorder={true}
  />
)}

    </div>
  );
}

export default FillControl;
