import { LessonUpdatableAction, LessonUpdates } from '@chess-tent/types';
import { getSubjectValueAt, Lesson, SubjectPath } from '@chess-tent/models';
import { uniqWith } from 'lodash';
import { utils } from '@application';
import { isEqual } from 'lodash';
import {
  MoveStep,
  MoveStepState,
  NotableMove,
  VariationStep,
  VariationStepState,
} from '@types';

const updatesMap: { [key: string]: LessonUpdatableAction[] } = {};

const isSamePathBase = (path1: SubjectPath, path2: SubjectPath) => {
  const shorterPath = path1.length < path2.length ? path1 : path2;
  for (let i = shorterPath.length - 1; i >= 0; i--) {
    if (path2[i] !== path1[i]) {
      return false;
    }
  }
  return true;
};

const removeWeakerPaths = (updates: LessonUpdates) => {
  return updates.filter(({ path }, index) => {
    return !updates.some((update, i) => {
      if (index === i) {
        return false;
      }
      return (
        path.length > update.path.length && isSamePathBase(path, update.path)
      );
    });
  });
};

export const addLessonUpdate = (action: LessonUpdatableAction) => {
  let actions = updatesMap[action.meta.lessonId];
  if (!actions) {
    actions = [];
    updatesMap[action.meta.lessonId] = actions;
  }
  actions.push(action);
};

export const getLessonUpdates = (lesson: Lesson): LessonUpdates => {
  // TODO - change signature to use NormalizedLesson - maybe a way to go is to use middleware for updates
  const normalizedLesson = utils.normalize(lesson).result;
  const updates = updatesMap[normalizedLesson.id]?.map(({ meta, payload }) => ({
    path: meta.path,
    value: payload,
  }));
  const uniqueUpdate = uniqWith(
    updates,
    (update1, update2) => update1?.path.join() === update2?.path.join(),
  );
  updatesMap[normalizedLesson.id] = [];
  return removeWeakerPaths(uniqueUpdate).map(update => ({
    ...update,
    value: getSubjectValueAt(normalizedLesson, update.path),
  }));
};

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
