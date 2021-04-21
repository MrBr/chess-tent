import _ from 'lodash';
import { Lesson, LessonDetailsStatus, User } from '@chess-tent/models';
import { LessonsRequest, LessonUpdates } from '@chess-tent/types';
import { MongooseFilterQuery } from 'mongoose';
import { utils, db, service } from '@application';
import { LessonModel, depopulate } from './model';

export const saveLesson = (lesson: Lesson) =>
  new Promise(resolve => {
    LessonModel.updateOne({ _id: lesson.id }, depopulate(lesson), {
      upsert: true,
    }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const publishLesson = (lessonId: Lesson['id'], lesson: Lesson) =>
  new Promise(resolve => {
    LessonModel.updateOne(
      { _id: lessonId },
      {
        $set: {
          'state.status': LessonDetailsStatus.PUBLISHED,
        },
        $push: { versions: lesson.state },
      },
    ).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const patchLesson = (lessonId: Lesson['id'], lesson: Partial<Lesson>) =>
  new Promise(resolve => {
    LessonModel.updateOne({ _id: lessonId }, { $set: depopulate(lesson) }).exec(
      (err, result) => {
        if (err) {
          throw err;
        }
        resolve();
      },
    );
  });

export const getLesson = (lessonId: Lesson['id']): Promise<Lesson | null> =>
  new Promise(resolve => {
    LessonModel.findById(lessonId)
      .populate('owner')
      .populate('tags')
      .populate('users')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result ? result.toObject() : null);
      });
  });

export const updateLessonSteps = (
  lessonId: Lesson['id'],
  updates: LessonUpdates,
) => {
  const $set = service.subjectPathUpdatesToMongoose$set(updates);
  return new Promise(resolve => {
    LessonModel.updateOne({ _id: lessonId }, { $set }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });
};

export const findLessons = (
  filters: Partial<LessonsRequest>,
): Promise<Lesson[]> =>
  new Promise(resolve => {
    const owner = utils.notNullOrUndefined({
      owner: filters.owner,
    });
    const users = db.inQuery('users', filters.users);
    const query: MongooseFilterQuery<any> = utils.notNullOrUndefined({
      published: filters.published,
      ...db.orQueries(owner, users),
    });

    if (filters.difficulty) {
      query['difficulty'] = { $eq: filters.difficulty };
    }

    if (!_.isEmpty(filters.tagIds)) {
      query['tags'] = { $in: filters.tagIds };
    }

    if (filters.search) {
      query['$text'] = { $search: filters.search, $caseSensitive: false };
    }

    LessonModel.find(query)
      .populate('owner')
      .populate('tags')
      .populate('users')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject()));
      });
  });

export const canEditLesson = (lessonId: Lesson['id'], userId: User['id']) =>
  new Promise((resolve, reject) => {
    getLesson(lessonId)
      .then(lesson =>
        resolve(
          !lesson ||
            lesson.owner.id === userId ||
            lesson.users?.some(({ id }) => id === userId),
        ),
      )
      .catch(reject);
  });
