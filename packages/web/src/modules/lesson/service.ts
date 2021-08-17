import { isEqual } from 'lodash';
import {
  MoveStep,
  MoveStepState,
  NotableMove,
  VariationStep,
  VariationStepState,
} from '@types';
import { Lesson, LessonActivity } from '@chess-tent/models';

export const hasVariationMove = (
  step: MoveStep | VariationStep,
  move: NotableMove,
) => {
  return step.state.steps.some(({ stepType, state }) => {
    if (stepType === 'variation' || stepType === 'move') {
      const stepMove = (state as MoveStepState | VariationStepState).move;
      return isEqual(stepMove, move);
    }
    return false;
  });
};

export const isOwned = (activities: LessonActivity[], lessonId: Lesson['id']) =>
  activities.some(({ subject }) => subject.id === lessonId);
