// PropertiesPanel.jsx
import { useEffect, useState } from 'react';
import './PropertiesPanel.css';
import FillControl from '../fillcontrol';
import BorderControl from '../bordercontrol';
import OpacityControl from '../opecitycontrol';
import ShadowControl from '../shadowcontrol';

function parseColor(rgbaString) {
  const match = rgbaString?.match?.(/rgba?\((\d+), ?(\d+), ?(\d+),? ?([\d\.]+)?\)/);
  if (!match) return { r: 0, g: 0, b: 0, a: 1 };
  const [, r, g, b, a = 1] = match;
  return {
    r: parseInt(r, 10),
    g: parseInt(g, 10),
    b: parseInt(b, 10),
    a: parseFloat(a),
  };
}

function hexToRgbObj(hex) {
  if (!hex) return { r: 0, g: 0, b: 0, a: 1 };
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const int = parseInt(h, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255, a: 1 };
}

function normalizeToColorObj(value) {
  // returns {r,g,b,a}
  if (!value) return { r: 0, g: 0, b: 0, a: 1 };
  if (typeof value === 'object') {
    // already object {r,g,b,a}
    return {
      r: value.r ?? 0,
      g: value.g ?? 0,
      b: value.b ?? 0,
      a: value.a ?? 1,
    };
  }
  if (typeof value === 'number') {
    // convert number -> hex -> rgb
    const hex = '#' + value.toString(16).padStart(6, '0');
    return hexToRgbObj(hex);
  }
  if (typeof value === 'string') {
    if (value.startsWith('#')) return hexToRgbObj(value);
    if (value.startsWith('rgb')) return parseColor(value);
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function colorObjToRgbaString(c) {
  const r = Math.round(c.r ?? 0);
  const g = Math.round(c.g ?? 0);
  const b = Math.round(c.b ?? 0);
  const a = typeof c.a === 'number' ? c.a : 1;
  return `rgba(${r},${g},${b},${a})`;
}

function PropertiesPanel({ shapes = [], selectedId, onUpdateShape }) {
  // فلترة العناصر الفاضية وحمايتها
  const safeShapes = Array.isArray(shapes) ? shapes.filter(Boolean) : [];
  const selected = safeShapes.find((s) => s?.id === selectedId) ?? null;

  const [fillEnabled, setFillEnabled] = useState(true);
  const [borderEnabled, setBorderEnabled] = useState(true);
  const [fill, setFill] = useState({ r: 255, g: 255, b: 255, a: 1 });
  const [stroke, setStroke] = useState({ r: 0, g: 0, b: 0, a: 1 });
  const [opacity, setOpacity] = useState(1);
  const [borderSize, setBorderSize] = useState(1);
  const [shadow, setShadow] = useState({
    color: { r: 0, g: 0, b: 0, a: 0.5 },
    offsetX: 5,
    offsetY: 5,
    blur: 10,
  });
  const [shadowEnabled, setShadowEnabled] = useState(true);

  const isDisabled = !selected;

  useEffect(() => {
    if (selected) {
      // نطبّع ألوان/قيم مختلفة إلى شكل موحد (object rgba)
      setFill(normalizeToColorObj(selected.fill ?? 'rgba(255,255,255,1)'));
      setStroke(normalizeToColorObj(selected.stroke ?? 'rgba(0,0,0,1)'));
      setOpacity(typeof selected.opacity === 'number' ? selected.opacity : (selected.opacity ?? 1));
      setBorderSize(typeof selected.strokeWidth === 'number' ? selected.strokeWidth : (selected.strokeWidth ?? 1));
      // shadow قد يكون object أو غير موجود
      const s = selected.shadow ?? {
        color: { r: 0, g: 0, b: 0, a: 0.5 },
        offsetX: 5,
        offsetY: 5,
        blur: 10,
      };
      // لو لون الظل نص/رقم نحوله object
      const shadowColorObj = normalizeToColorObj(s.color);
      setShadow({ ...s, color: shadowColorObj });
      setShadowEnabled(Boolean(s && s.color));
    } else {
      // لو ما فيه selected ممكن تريح القيم الافتراضية أو تتركها كما هي
    }
  }, [selected]);

  const update = (prop, value) => {
    if (!selected) return;
    if (typeof onUpdateShape !== 'function') return;

    // إذا كان اللي بنرسله هو لون كـ object حوّله لنص rgba لأن Konva يتوقع string
    if (prop === 'fill' || prop === 'stroke') {
      const rgbaStr = colorObjToRgbaString(value);
      onUpdateShape(selected.id, { [prop]: rgbaStr });
      return;
    }

    if (prop === 'shadow') {
      const sh = { ...value };
      if (sh.color) {
        sh.color = colorObjToRgbaString(sh.color);
      }
      onUpdateShape(selected.id, { shadow: sh });
      return;
    }

    onUpdateShape(selected.id, { [prop]: value });
  };

  return (
    <div className="panel-container">
      <OpacityControl
        disabled={isDisabled}
        opacity={opacity}
        onChange={(val) => {
          setOpacity(val);
          update('opacity', val);
        }}
      />
      <FillControl
        disabled={isDisabled}
        fillEnabled={fillEnabled}
        setFillEnabled={setFillEnabled}
        fill={fill}
        setFill={setFill}
        update={update}
      />
      <BorderControl
        disabled={isDisabled}
        borderEnabled={borderEnabled}
        setBorderEnabled={setBorderEnabled}
        stroke={stroke}
        setStroke={setStroke}
        borderSize={borderSize}
        setBorderSize={setBorderSize}
        update={update}
      />
      <hr style={{ border: '0.5px solid #ccc', margin: '1rem 0' }} />
      <div className='EFFECTS'>EFFECTS</div>
      <ShadowControl
        disabled={isDisabled}
        shadow={shadow}
        setShadow={setShadow}
        enabled={shadowEnabled}
        setEnabled={setShadowEnabled}
        update={update}
      />
    </div>
  );
}

export default PropertiesPanel;
