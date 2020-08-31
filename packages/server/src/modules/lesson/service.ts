import { LessonModel, depopulate } from "./model";
import { Lesson } from "@chess-tent/models";

export const saveLesson = (lesson: Lesson) =>
  new Promise((resolve, reject) => {
    LessonModel.updateOne({ _id: lesson.id }, depopulate(lesson), {
      upsert: true
    }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const patchLesson = (lesson: Lesson) =>
  new Promise((resolve, reject) => {
    LessonModel.updateOne(
      { _id: lesson.id },
      { $set: depopulate(lesson) }
    ).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const getLesson = (lessonId: Lesson["id"]): Promise<Lesson | null> =>
  new Promise((resolve, reject) => {
    LessonModel.findById(lessonId)
      .populate("owner")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result ? result.toObject() : null);
      });
  });

export const findLessons = (lesson: Partial<Lesson>): Promise<Lesson[]> =>
  new Promise((resolve, reject) => {
    LessonModel.find(LessonModel.translateAliases(lesson))
      .populate("owner")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject()));
      });
  });
