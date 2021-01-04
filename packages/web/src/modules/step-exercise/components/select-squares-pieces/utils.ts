import { Shape } from '@types';

export const isSelectionCorrect = (shapes: Shape[], selectedShape: Shape) =>
  shapes.some(shape => shape.orig === selectedShape.orig);

export const isLastSelectionCorrect = (
  shapes: Shape[],
  selectedShapes: Shape[] | undefined,
): boolean | undefined => {
  if (!selectedShapes?.length) {
    return;
  }
  const shape = selectedShapes[selectedShapes.length - 1];
  return isSelectionCorrect(shapes, shape);
};

export const getCorrectSelectionsCount = (
  shapes: Shape[],
  selectedShapes: Shape[] | undefined,
): number => {
  if (!selectedShapes?.length) {
    return 0;
  }
  return selectedShapes.reduce(
    (count, shape) => (isSelectionCorrect(shapes, shape) ? count + 1 : count),
    0,
  );
};
