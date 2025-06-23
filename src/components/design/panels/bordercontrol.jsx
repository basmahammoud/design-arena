import ColorPickerPopover from '../../models/color/color';

function BorderControl({ borderEnabled, setBorderEnabled, stroke, setStroke, borderSize, setBorderSize, update,disabled }) {
  return (
    <div className="section">
      <label>
        <input
          type="checkbox"
          checked={borderEnabled}
          onChange={() => {
            const newEnabled = !borderEnabled;
            setBorderEnabled(newEnabled);
            if (!newEnabled) {
              const transparent = { r: 0, g: 0, b: 0, a: 0 };
              setStroke(transparent);
              setBorderSize(0);
              update('stroke', 'rgba(0,0,0,0)');
              update('strokeWidth', 0);
            }
          }}
        />
        Border
      </label>

      {borderEnabled && (
        <>
          <ColorPickerPopover
            color={stroke}
            onChange={(newColor) => {
              setStroke(newColor);
              update(
                'stroke',
                `rgba(${newColor.r},${newColor.g},${newColor.b},${newColor.a})`
              );
            }}
            showBorder={true}
          />
          
          <div>
            <label>Size</label>
            <input
              type="number"
              min="0"
              value={borderSize}
              disabled={disabled}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                setBorderSize(size);
                update('strokeWidth', size);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default BorderControl;
