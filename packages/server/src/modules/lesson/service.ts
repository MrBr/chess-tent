import _ from "lodash";
import { LessonModel, depopulate } from "./model";
import {
  Chapter,
  Lesson,
  SubjectPath,
  Step,
  Difficulty,
} from "@chess-tent/models";
import { LessonUpdates } from "@chess-tent/types";
import { service } from "@application";
import { MongooseFilterQuery } from "mongoose";
import { utils } from "@application";

const lessonValuePathToMongoosePath = (path: SubjectPath) => {
  return path.join(".");
};

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

export const findLessons = (
  filters: Partial<{
    owner?: string;
    search?: string;
    difficulty?: Difficulty;
    tagIds?: string[];
  }>
): Promise<Lesson[]> =>
  new Promise((resolve) => {
    const query: MongooseFilterQuery<any> = utils.notNullOrUndefined({
      owner: filters.owner,
    });

    if (filters.difficulty) {
      query["difficulty"] = { $eq: filters.difficulty };
    }

    if (!_.isEmpty(filters.tagIds)) {
      query["tags"] = { $in: filters.tagIds };
    }

    if (filters.search) {
      query["$text"] = { $search: filters.search, $caseSensitive: false };
    }

    LessonModel.find(filters)
      .populate("owner")
      .populate("tags")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map((item) => item.toObject()));
      });
  });
