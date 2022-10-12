import { NormalizedUser, User } from '@chess-tent/models';
import { COACH_REQUIRED_STATE, WithPagination } from '@chess-tent/types';
import { AppDocument } from '@types';
import { compare, hash } from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { utils, service, db } from '@application';
import { UserModel } from './model';

export const addUser = (user: User) =>
  new Promise((resolve, reject) => {
    new UserModel(user).save((err, result) => {
      if (err) {
        reject('Failed to create user');
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

export const findCoaches = (
  // TODO - validate filters (whole app)
  filters: Partial<{
    name?: string;
    search?: string;
    studentElo?: {
      from?: number;
      to?: number;
    };
    speciality?: string;
  }>,
  options?: WithPagination,
): Promise<User[]> => {
  const query: FilterQuery<AppDocument<NormalizedUser>> =
    utils.notNullOrUndefined({
      coach: true,
      name: filters.name,
    });

  if (filters.studentElo) {
    if (filters.studentElo.from) {
      query['state.studentEloMin'] = { $lte: filters.studentElo.from };
    }

    if (filters.studentElo.to) {
      query['state.studentEloMax'] = { $gte: filters.studentElo.to };
    }
  }

  // TODO: connect tags to users
  if (filters.speciality) {
    query['state.speciality'] = { $eq: filters.speciality };
  }

  if (filters.search) {
    query['$text'] = { $search: filters.search, $caseSensitive: false };
  }

  // Check all required public info
  COACH_REQUIRED_STATE.forEach(key => {
    query[`state.${key}`] = query[`state.${key}`] || {
      $exists: true,
      $ne: '',
    };
  });

  return new Promise((resolve, reject) => {
    UserModel.find(query)
      // .limit()
      // .skip()
      .sort([
        ['state.lastActivity', -1],
        ['_id', 1],
      ])
      .exec((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.map(item => item.toObject()));
      });
  });
};

export const validateUser = async (
  user: Partial<User>,
  skipPaths?: (keyof User)[],
) => {
  const invalidUserDataError = new UserModel(user).validateSync({
    pathsToSkip: skipPaths,
  });
  if (invalidUserDataError) {
    throw invalidUserDataError;
  }

  const takenUniqueFields = await db.testUniqueFields(UserModel, user);
  if (takenUniqueFields.length > 0) {
    throw new Error(
      `Field(s): ${takenUniqueFields.join(',')} are already taken.`,
    );
  }
};

export const hashPassword = (password: string) => {
  return hash(password, parseInt(process.env.SALT_ROUNDS as string));
};

export const validateUserPassword = (user: User, passwordHash: string) => {
  return compare(user.password, passwordHash);
};
