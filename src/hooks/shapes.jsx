import { create } from 'zustand';

const useSelectedShape = create((set) => ({
  selectedShapeId: null,
  setSelectedShapeId: (id) => set({ selectedShapeId: id }),
}));

export default useSelectedShape;
