import _ from 'lodash';
import {
  Lesson,
  User,
  publishLesson as publishLessonService,
  canEditLesson as canEditLessonService,
  canAccessLesson as canAccessLessonService,
  Chapter,
} from '@chess-tent/models';
import { AppDocument } from '@types';
import { LessonsFilters, LessonUpdates } from '@chess-tent/types';
import { FilterQuery } from 'mongoose';
import { utils, db, service } from '@application';
import { LessonModel, depopulate, DepupulatedLesson } from './model';

export const saveLesson = (lesson: Lesson) =>
  new Promise<void>(resolve => {
    LessonModel.updateOne({ _id: lesson.id }, depopulate(lesson), {
      upsert: true,
    }).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const getLesson = (
  lessonId: Lesson['id'],
  populate = 'owner tags users',
): Promise<Lesson | null> =>
  new Promise(resolve => {
    LessonModel.findById(lessonId)
      .populate(populate)
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result ? result.toObject<Lesson>() : null);
      });
  });

export const getLessonChapters = async (
  lessonId: Lesson['id'],
  chapterIds: string[],
): Promise<Chapter[]> => {
  const lessons = await LessonModel.aggregate([
    { $match: { _id: lessonId } },
    { $limit: 1 },
    {
      $project: {
        'state.chapters': {
          $filter: {
            input: '$state.chapters',
            as: 'chapters',
            cond: {
              $in: ['$$chapters.id', chapterIds],
            },
          },
        },
      },
    },
  ]);

  return lessons[0].state.chapters;
};

export const deleteLesson = async (lessonId: Lesson['id']) => {
  await LessonModel.deleteOne({ _id: lessonId });
};

export const publishLesson = (lessonId: Lesson['id']) =>
  new Promise<void>(async resolve => {
    const lesson = await getLesson(lessonId, '');
    if (!lesson) {
      throw new Error('Publishing non-existing lesson.');
    }
    LessonModel.bulkWrite(
      [
        {
          updateOne: {
            filter: { docId: lessonId },
            update: {
              $setOnInsert: { _id: service.generateIndex() },
              $set: {
                ...publishLessonService(lesson as Lesson),
                docId: lessonId,
              },
            },
            upsert: true,
          },
        },
        {
          updateOne: {
            filter: { _id: lessonId },
            update: {
              $set: {
                published: true,
              },
            },
          },
        },
      ],
      {},
      err => {
        if (err) {
          throw err;
        }
        resolve();
      },
    );
  });

export const unpublishLesson = (lessonId: Lesson['id']) =>
  new Promise<void>(resolve => {
    LessonModel.bulkWrite(
      [
        {
          updateOne: {
            filter: { docId: lessonId },
            update: {
              $set: {
                published: false,
              },
            },
          },
        },
        {
          updateOne: {
            filter: { _id: lessonId },
            update: {
              $set: {
                published: false,
              },
            },
          },
        },
      ],
      {},
      err => {
        if (err) {
          throw err;
        }
        resolve();
      },
    );
  });

export const patchLesson = (lessonId: Lesson['id'], lesson: Partial<Lesson>) =>
  new Promise<void>(resolve => {
    LessonModel.updateOne({ _id: lessonId }, { $set: depopulate(lesson) }).exec(
      err => {
        if (err) {
          throw err;
        }
        resolve();
      },
    );
  });

export const updateLessonSteps = (
  lessonId: Lesson['id'],
  updates: LessonUpdates,
) => {
  const { $set, $unset } = service.subjectPathUpdatesToMongoose(updates);
  return new Promise<void>(resolve => {
    LessonModel.updateOne({ _id: lessonId }, { $set, $unset }).exec(
      (err, result) => {
        if (err) {
          throw err;
        }
        resolve();
      },
    );
  });
};

export const findLessons = (
  filters: Partial<LessonsFilters>,
): Promise<Lesson[]> =>
  new Promise(resolve => {
    const owner = utils.notNullOrUndefined({
      owner: filters.owner,
    });
    const users = db.inQuery('users', filters.users);
    const query: FilterQuery<AppDocument<DepupulatedLesson>> =
      utils.notNullOrUndefined({
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

    if (filters.hasDocId === true) {
      query['docId'] = { $exists: true, $ne: undefined };
    }

    if (filters.hasDocId === false) {
      query['docId'] = { $not: { $exists: true, $ne: undefined } };
    }

    LessonModel.find(query)
      .populate('owner')
      .populate('tags')
      .populate('users')
      .select('-state.chapters.state.steps.state.steps')
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject<Lesson>()));
      });
  });

export const canEditLesson = (lessonId: Lesson['id'], userId: User['id']) =>
  new Promise((resolve, reject) => {
    getLesson(lessonId)
      .then(lesson => resolve(!lesson || canEditLessonService(lesson, userId)))
      .catch(reject);
  });

export const canAccessLesson = (lessonId: Lesson['id'], userId: User['id']) =>
  new Promise((resolve, reject) => {
    getLesson(lessonId)
      .then(lesson =>
        resolve(!!lesson && canAccessLessonService(lesson, userId)),
      )
      .catch(reject);
  });
