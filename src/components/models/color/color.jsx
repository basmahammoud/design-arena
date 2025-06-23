import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { GiEyedropper } from "react-icons/gi";

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

function ColorPickerPopover({ color, onChange, showBorder }) {
  const [showPicker, setShowPicker] = useState(false);
  

  // ✅ تشغيل القطارة
  const handleEyedropper = async () => {
    if (!window.EyeDropper) {
      alert('المتصفح لا يدعم القطارة.');
      return;
    }
    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const newColor = hexToRgba(result.sRGBHex, color.a);
      onChange(newColor);
    } catch (e) {
      console.log('تم إلغاء القطارة');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        className="color-preview"
        style={{
          width: 24,
          height: 24,
          backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          border: showBorder ? '1px solid #ccc' : 'none',
          cursor: 'pointer',
        }}
        onClick={() => setShowPicker(!showPicker)}
      />
      {showPicker && (
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            marginTop: 10,
          }}
        >
          <SketchPicker
            color={color}
            onChange={(color) => onChange(color.rgb)}
          />
          {/* ✅ زر القطارة */}
          <button
            onClick={handleEyedropper}
            title="التقاط لون من الشاشة"
            style={{
                    position: 'absolute',
                    top: '270px', 
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
            }}
          >
          <GiEyedropper />
          </button>
        </div>
      )}
    </div>
  );
}

export default ColorPickerPopover;
