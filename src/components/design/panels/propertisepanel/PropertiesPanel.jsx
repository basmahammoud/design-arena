import { useEffect, useState } from 'react';
import useSelectedShape from '../../../../hooks/shapes';
import './PropertiesPanel.css';
import FillControl from '../fillcontrol';
import BorderControl from '../bordercontrol';
import OpacityControl from '../opecitycontrol';
import ShadowControl from '../shadowcontrol';

function parseColor(rgbaString) {
  const match = rgbaString.match(/rgba?\((\d+), ?(\d+), ?(\d+),? ?([\d\.]+)?\)/);
  if (!match) return { r: 0, g: 0, b: 0, a: 1 };
  const [, r, g, b, a = 1] = match;
  return {
    r: parseInt(r, 10),
    g: parseInt(g, 10),
    b: parseInt(b, 10),
    a: parseFloat(a),
  };
}

function PropertiesPanel({ shapes, selectedId, onUpdateShape }) {
  const selected = shapes.find((s) => s.id === selectedId);
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
      setFill(parseColor(selected.fill || 'rgba(255,255,255,1)'));
      setStroke(parseColor(selected.stroke || 'rgba(0,0,0,1)'));
      setOpacity(selected.opacity || 1);
      setBorderSize(selected.strokeWidth || 1);

      if (selected.shadow) {
        setShadow(selected.shadow);
      } else {
        setShadow({
          color: { r: 0, g: 0, b: 0, a: 0.5 },
          offsetX: 5,
          offsetY: 5,
          blur: 10,
        });
      }
    }
  }, [selected]);

  const update = (prop, value) => {
    if (selected) {
      onUpdateShape(selected.id, { [prop]: value });
    }
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
        <div className='EFFECTS'>
          EFFECTS
         </div>
         
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
