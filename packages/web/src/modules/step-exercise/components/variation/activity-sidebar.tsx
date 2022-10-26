import React, { ComponentProps, FunctionComponent } from 'react';
import { ui } from '@application';
import {
  ExerciseModule,
  ExerciseVariationActivityState,
  ExerciseVariationStep,
} from '@types';
import { SegmentActivitySidebar } from '../segment';

const { Text } = ui;

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseVariationStep>['ActivitySidebar']>
> = props => {
  const { step, stepActivityState, setStepActivityState } = props;
  const { activeMoveIndex, correct, completed } =
    stepActivityState as ExerciseVariationActivityState;
  const { task } = step.state;
  const moveToPlayIndex = activeMoveIndex || 0;
  const stepToPlayMove = task.moves?.[moveToPlayIndex];

  const reset = () =>
    setStepActivityState({ move: null, activeMoveIndex: null, correct: null });

  return (
    <SegmentActivitySidebar
      title="Play variation"
      {...props}
      onReset={moveToPlayIndex > 0 ? reset : undefined}
    >
      <Text fontSize="smallest" className="text-capitalize m-0">
        {correct && !completed
          ? 'Excellent, continue..'
          : correct === false
          ? 'Wrong move, try again'
          : stepToPlayMove
          ? stepToPlayMove.piece?.color + ' to play'
          : 'Done!'}
      </Text>
    </SegmentActivitySidebar>
  );
};

export default Playground;
