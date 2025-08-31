const shadowProps = {
  shadowColor: 'rgba(0,0,0,0.4)',
  shadowBlur: 10,
  shadowOffset: { x: 5, y: 5 },
  shadowOpacity: 0.6,
};

export const createElement = (type, id) => {
  switch (type) {
    case 'text':
      return {
        id,
        type,
        text: 'نص جديد',
        x: 50,
        y: 50,
        fontSize: 24,
        fill: 'black',
        draggable: true,
      };
    case 'circle':
      return {
        id,
        type,
        x: 150,
        y: 150,
        radius: 50,
        fill: 'red',
        draggable: true,
        ...shadowProps,
      };
    case 'oval':
      return {
        id,
        type,
        x: 200,
        y: 200,
        radiusX: 60,
        radiusY: 40,
        fill: 'green',
        draggable: true,
        ...shadowProps,
      };
    case 'square':
      return {
        id,
        type: 'rect',
        x: 100,
        y: 100,
        width: 80,
        height: 80,
        fill: 'blue',
        draggable: true,
        ...shadowProps,
      };
    case 'rect':
      return {
        id,
        type,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        fill: 'blue',
        draggable: true,
        ...shadowProps,
      };
    case 'triangle':
      return {
        id,
        type,
        points: [0, 80, 40, 0, 80, 80],
        x: 150,
        y: 150,
        fill: 'orange',
        draggable: true,
        ...shadowProps,
      };
    case 'line-horizontal':
      return {
        id,
        type: 'line',
        points: [50, 50, 150, 50],
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        ...shadowProps,
      };
    case 'line-vertical':
      return {
        id,
        type: 'line',
        points: [50, 50, 50, 150],
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        ...shadowProps,
      };
    case 'line':
      return {
        id,
        type: 'line',
        points: [20, 20, 100, 100],
        stroke: 'black',
        strokeWidth: 2,
        draggable: true,
        ...shadowProps,
      };
    case 'table':
      return {
        id,
        type: 'rect',
        x: 150,
        y: 150,
        width: 200,
        height: 100,
        fill: '#eee',
        draggable: true,
        ...shadowProps,
      };
    case 'draw':
      return {
        id,
        type,
        points: [],
        stroke: 'black',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round',
        ...shadowProps,
      };
    case 'image':
      return {
        id,
        type,
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        src: '', 
        draggable: true,
        ...shadowProps,
      };
    default:
      return null;
  }
};
