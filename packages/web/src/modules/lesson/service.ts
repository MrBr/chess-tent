import { LessonUpdates, UpdateLessonStepAction } from '@chess-tent/types';
import { getLessonStepAt, Lesson } from '@chess-tent/models';
import { uniqWith } from 'lodash';

const updatesMap: { [key: string]: UpdateLessonStepAction[] } = {};

const isSamePathBase = (path1: number[], path2: number[]) => {
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

export const addLessonUpdate = (action: UpdateLessonStepAction) => {
  let actions = updatesMap[action.meta.lessonId];
  if (!actions) {
    actions = [];
    updatesMap[action.meta.lessonId] = actions;
  }
  actions.push(action);
};

export const getLessonUpdates = (lesson: Lesson): LessonUpdates => {
  const updates = updatesMap[lesson.id]?.map(({ meta, payload }) => ({
    path: meta.path,
    entity: payload,
  }));
  const uniqueUpdate = uniqWith(
    updates,
    (update1, update2) => update1.path.join() === update2.path.join(),
  );
  updatesMap[lesson.id] = [];
  return removeWeakerPaths(uniqueUpdate).map(update => ({
    ...update,
    entity: getLessonStepAt(lesson, update.path),
  }));
};
