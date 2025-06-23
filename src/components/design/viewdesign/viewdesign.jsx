import { Stage, Layer, Text } from 'react-konva';
import { useParams } from 'react-router-dom';
import useWebDesign from '../../../hooks/useviewdesign';

const DesignViewer = () => {
  const { id } = useParams();
  const { design, loading, error } = useWebDesign(id);

  return (
   
      <div className="p-4">
        {error && <p className="text-red-500">حدث خطأ أثناء تحميل التصميم.</p>}
        {design && (
          <>
            <h2 className="text-2xl font-bold mb-4">{design.name}</h2>
            <div className="border rounded shadow overflow-hidden">
              <Stage width={800} height={600}>
                <Layer>
                  {design.json_data.map((item, index) => {
                    if (item.type === 'text') {
                      return (
                        <Text
                          key={index}
                          x={item.x}
                          y={item.y}
                          text={item.text}
                          fontSize={item.fontSize}
                          fill={item.fill}
                          draggable={item.draggable}
                        />
                      );
                    }
                    return null;
                  })}
                </Layer>
              </Stage>
            </div>
          </>
        )}
      </div>
  );
};

export default DesignViewer;
