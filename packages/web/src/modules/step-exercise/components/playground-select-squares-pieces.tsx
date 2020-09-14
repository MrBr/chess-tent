import React, { ComponentProps, FunctionComponent, useCallback } from 'react';
import { components, ui } from '@application';
import {
  ExerciseActivitySelectSquaresAndPiecesState,
  ExerciseModule,
  ExerciseSelectSquaresAndPiecesState,
  Shape,
} from '@types';
import { isStepCompleted } from '@chess-tent/models';

const { Chessboard, LessonPlayground } = components;
const { Headline3, Text } = ui;

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['Playground']
>> = ({
  step,
  status,
  stepActivityState,
  setStepActivityState,
  activity,
  completeStep,
}) => {
  const { position, shapes } = step.state;
  const {
    selectedShapes,
  } = stepActivityState as ExerciseActivitySelectSquaresAndPiecesState;
  const { question, explanation } = step.state
    .exerciseState as ExerciseSelectSquaresAndPiecesState;
  const completed = isStepCompleted(activity, step);
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
    <LessonPlayground
      board={
        <Chessboard
          fen={position}
          header={status}
          shapes={selectedShapes}
          animation
          onShapesChange={handleShapesChange}
          validateDrawable={validateShapes}
        />
      }
      sidebar={
        <>
          <Headline3>Select the squares and pieces</Headline3>
          <Text>{question}</Text>
          {completed && <Text>{explanation}</Text>}
        </>
      }
    />
  );
};

export default Playground;
