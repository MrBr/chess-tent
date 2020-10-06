import { LessonModel, depopulate } from "./model";
import { Chapter, Lesson, SubjectPath, Step } from "@chess-tent/models";
import { LessonUpdates } from "@chess-tent/types";

const lessonValuePathToMongoosePath = (path: SubjectPath) => {
  return path.join(".");
};

export const saveLesson = (lesson: Lesson) =>
  new Promise(resolve => {
    LessonModel.updateOne({ _id: lesson.id }, depopulate(lesson), {
      upsert: true
    }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const patchLesson = (lessonId: Lesson["id"], lesson: Partial<Lesson>) =>
  new Promise(resolve => {
    LessonModel.updateOne({ _id: lessonId }, { $set: depopulate(lesson) }).exec(
      (err, result) => {
        if (err) {
          throw err;
        }
        resolve();
      }
    );
  });

export const getLesson = (lessonId: Lesson["id"]): Promise<Lesson | null> =>
  new Promise(resolve => {
    LessonModel.findById(lessonId)
      .populate("owner")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result ? result.toObject() : null);
      });
  });

export const updateLessonSteps = (
  lessonId: Lesson["id"],
  updates: LessonUpdates
) => {
  const $set = updates.reduce<Record<string, Step | Chapter>>(
    (result, update) => {
      const path = lessonValuePathToMongoosePath(update.path);
      result[path] = update.value;
      return result;
    },
    {}
  );
  return new Promise(resolve => {
    LessonModel.updateOne({ _id: lessonId }, { $set }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });
};

export const findLessons = (lesson: Partial<Lesson>): Promise<Lesson[]> =>
  new Promise(resolve => {
    LessonModel.find(LessonModel.translateAliases(lesson))
      .populate("owner")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject()));
      });
  });
