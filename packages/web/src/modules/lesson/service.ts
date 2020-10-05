import { LessonUpdatableAction, LessonUpdates } from '@chess-tent/types';
import { getLessonValueAt, Lesson, LessonPath } from '@chess-tent/models';
import { uniqWith } from 'lodash';

const updatesMap: { [key: string]: LessonUpdatableAction[] } = {};

const isSamePathBase = (path1: LessonPath, path2: LessonPath) => {
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
  const updates = updatesMap[lesson.id]?.map(({ meta, payload }) => ({
    path: meta.path,
    value: payload,
  }));
  const uniqueUpdate = uniqWith(
    updates,
    (update1, update2) => update1?.path.join() === update2?.path.join(),
  );
  updatesMap[lesson.id] = [];
  return removeWeakerPaths(uniqueUpdate).map(update => ({
    ...update,
    value: getLessonValueAt(lesson, update.path),
  }));
};
