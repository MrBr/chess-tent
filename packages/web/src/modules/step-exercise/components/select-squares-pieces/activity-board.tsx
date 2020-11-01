import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import {
  ExerciseActivitySelectSquaresAndPiecesState,
  ExerciseModule,
  Shape,
} from '@types';

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['ActivityBoard']
>> = ({
  step,
  stepActivityState,
  setStepActivityState,
  completeStep,
  Footer,
  Chessboard,
}) => {
  const { position, shapes } = step.state;
  const {
    selectedShapes,
  } = stepActivityState as ExerciseActivitySelectSquaresAndPiecesState;
  const handleShapesChange = useCallback(
    (newSelectedShapes: Shape[]) => {
      const selectedShapes = newSelectedShapes.map(selectedShape => {
        return shapes.some(shape => shape.orig === selectedShape.orig)
          ? selectedShape
          : {
              ...selectedShape,
              brush: 'red',
            };
      });
      if (
        shapes.every(shape =>
          selectedShapes.some(
            selectedShape => selectedShape.orig === shape.orig,
          ),
        )
      ) {
        completeStep(step);
      }
      setStepActivityState({
        selectedShapes,
      });
    },
    [completeStep, setStepActivityState, shapes, step],
  );
  const validateShapes = useCallback((shape: Shape) => {
    return !shape.dest;
  }, []);

  return (
    <Chessboard
      fen={position}
      shapes={selectedShapes}
      animation
      onShapesChange={handleShapesChange}
      validateDrawable={validateShapes}
      footer={<Footer />}
    />
  );
};

export default Playground;
