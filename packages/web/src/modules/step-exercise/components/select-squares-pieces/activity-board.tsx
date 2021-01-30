import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import {
  ExerciseActivitySelectSquaresAndPiecesState,
  ExerciseModule,
  ExerciseSelectSquaresAndPiecesStep,
  Shape,
} from '@types';
import { isSelectionCorrect } from './utils';

const Playground: FunctionComponent<
  ComponentProps<
    ExerciseModule<ExerciseSelectSquaresAndPiecesStep>['ActivityBoard']
  >
> = ({
  step,
  stepActivityState,
  setStepActivityState,
  completeStep,
  Footer,
  Chessboard,
}) => {
  const {
    task: { position, shapes },
  } = step.state;
  const {
    selectedShapes,
  } = stepActivityState as ExerciseActivitySelectSquaresAndPiecesState;
  const handleShapesChange = useCallback(
    (newSelectedShapes: Shape[]) => {
      const selectedShapes = newSelectedShapes.map(selectedShape => {
        return shapes && isSelectionCorrect(shapes, selectedShape)
          ? selectedShape
          : {
              ...selectedShape,
              brush: 'red',
            };
      });
      if (
        shapes?.every(shape =>
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
