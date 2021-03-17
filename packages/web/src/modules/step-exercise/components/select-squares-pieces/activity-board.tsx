import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import {
  ExerciseActivitySelectSquaresAndPiecesState,
  ExerciseModule,
  ExerciseSelectSquaresAndPiecesStep,
  Shape,
} from '@types';
import { isSelectionCorrect } from './utils';
import { SegmentActivityBoard } from '../segment';

const Playground: FunctionComponent<
  ComponentProps<
    ExerciseModule<ExerciseSelectSquaresAndPiecesStep>['ActivityBoard']
  >
> = props => {
  const { step, stepActivityState, setStepActivityState, completeStep } = props;
  const {
    task: { shapes },
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
    <SegmentActivityBoard
      shapes={selectedShapes}
      animation
      onShapesChange={handleShapesChange}
      validateDrawable={validateShapes}
      {...props}
    />
  );
};

export default Playground;
