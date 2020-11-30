import { LessonModel, depopulate } from "./model";
import { Lesson } from "@chess-tent/models";
import { LessonUpdates } from "@chess-tent/types";
import { service } from "@application";

export const saveLesson = (lesson: Lesson) =>
  new Promise((resolve) => {
    LessonModel.updateOne({ _id: lesson.id }, depopulate(lesson), {
      upsert: true,
    }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const patchLesson = (lessonId: Lesson["id"], lesson: Partial<Lesson>) =>
  new Promise((resolve) => {
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
  new Promise((resolve) => {
    LessonModel.findById(lessonId)
      .populate("owner")
      .populate("tags")
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
  const $set = service.subjectPathUpdatesToMongoose$set(updates);
  return new Promise((resolve) => {
    LessonModel.updateOne({ _id: lessonId }, { $set }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });
};

export const findLessons = (lesson: Partial<Lesson>): Promise<Lesson[]> =>
  new Promise((resolve) => {
    LessonModel.find(LessonModel.translateAliases(lesson))
      .populate("owner")
      .populate("tags")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map((item) => item.toObject()));
      });
  });
