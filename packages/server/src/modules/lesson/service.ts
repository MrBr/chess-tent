import { LessonModel } from "./model";
import { Lesson } from "@chess-tent/models";

export const saveLesson = (lesson: Lesson) =>
  new Promise((resolve, reject) => {
    new LessonModel(lesson).depopulate().save((err, result) => {
      err ? reject(err) : resolve(result.toObject() as typeof lesson);
    });
  });

export const getLesson = (lessonId: Lesson["id"]): Promise<Lesson | null> =>
  new Promise((resolve, reject) => {
    LessonModel.findById(lessonId)
      .populate("owner")
      .exec((err, result) => {
        err ? reject(err) : resolve(result ? result.toObject() : null);
      });
  });

export const findLessons = (lesson: Partial<Lesson>): Promise<Lesson[]> =>
  new Promise((resolve, reject) => {
    LessonModel.find(LessonModel.translateAliases(lesson))
      .populate("owner")
      .exec((err, result) => {
        err ? reject(err) : resolve(result.map(item => item.toObject()));
      });
  });
