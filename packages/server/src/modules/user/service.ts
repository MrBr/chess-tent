import _ from 'lodash';
import { NormalizedUser, User } from '@chess-tent/models';
import { WithPagination } from '@chess-tent/types';
import { AppDocument } from '@types';
import { compare, hash } from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { utils, service } from '@application';
import { UserModel } from './model';

export const addUser = (user: User) =>
  new Promise((resolve, reject) => {
    new UserModel(user).save((err, result) => {
      if (err) {
        const error =
          // TODO - see how to make the error typesafe
          // @ts-ignore
          err.code === 11000
            ? {
                // @ts-ignore
                message: `Field(s): ${Object.keys(err.keyValue).join(
                  ',',
                )} are already taken.`,
              }
            : 'Failed to create user';
        reject(error);
        return;
      }
      resolve(result.toObject() as typeof user);
    });
  });

export const updateUser = (
  userId: User['id'],
  user: Partial<User>,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const userPatch = service.flattenStateToMongoose$set(user);
    UserModel.updateOne({ _id: userId }, { $set: userPatch }).exec(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

export const getUser = (
  userDescr: Partial<User>,
  projection = '',
): Promise<User | null> =>
  new Promise((resolve, reject) => {
    UserModel.findOne(
      UserModel.translateAliases(userDescr),
      projection,
      {},
      (err, user) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(user ? user.toObject() : null);
      },
    );
  });

export const findUsers = (
  // TODO - validate filters (whole app)
  filters: Partial<{
    coach?: boolean;
    name?: string;
    search?: string;
    studentElo?: {
      from?: number;
      to?: number;
    };
    speciality?: string;
  }>,
  options: WithPagination,
): Promise<User[]> => {
  const query: FilterQuery<AppDocument<NormalizedUser>> =
    utils.notNullOrUndefined({
      coach: filters.coach,
      name: filters.name,
    });

  if (filters.studentElo) {
    const studentEloFilter: { $gt?: number; $lte?: number } = {};
    if (filters.studentElo.from) {
      studentEloFilter['$gt'] = filters.studentElo.from;
    }

    if (filters.studentElo.to) {
      studentEloFilter['$lte'] = filters.studentElo.to;
    }

    if (!_.isEmpty(studentEloFilter)) {
      query['state.studentElo'] = studentEloFilter;
    }
  }

  // TODO: connect tags to users
  if (filters.speciality) {
    query['state.speciality'] = { $eq: filters.speciality };
  }

  if (filters.search) {
    query['$text'] = { $search: filters.search, $caseSensitive: false };
  }

  return new Promise((resolve, reject) => {
    UserModel.find(query)
      // .limit()
      // .skip()
      .exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.map(item => item.toObject()));
      });
  });
};

export const validateUser = (user: {}) => {
  return new UserModel(user).validateSync();
};

export const hashPassword = (password: string) => {
  return hash(password, parseInt(process.env.SALT_ROUNDS as string));
};

export const validateUserPassword = (user: User, passwordHash: string) => {
  return compare(user.password, passwordHash);
};
