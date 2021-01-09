import _ from 'lodash';
import { UserModel } from './model';
import { User } from '@chess-tent/models';
import { compare, hash } from 'bcrypt';
import { MongooseFilterQuery } from 'mongoose';
import { utils, service } from '@application';

export const addUser = (user: User) =>
  new Promise((resolve, reject) => {
    new UserModel(user).save((err, result) => {
      if (err) {
        const error =
          err.code === 11000
            ? {
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
    UserModel.updateOne({ _id: userId }, { $set: userPatch }).exec(
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      },
    );
  });

export const getUser = (
  userDescr: Partial<User>,
  projection = '',
): Promise<User | null> =>
  new Promise((resolve, reject) => {
    UserModel.findOne(
      UserModel.translateAliases(userDescr),
      projection,
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
    coach?: string;
    name?: string;
    search?: string;
    elo?: {
      from?: number;
      to?: number;
    };
    speciality?: string;
  }>,
): Promise<User[]> => {
  const query: MongooseFilterQuery<any> = utils.notNullOrUndefined({
    coach: filters.coach,
    name: filters.name,
  });

  if (filters.elo) {
    const eloFilter: { $gt?: number; $lte?: number } = {};
    if (filters.elo.from) {
      eloFilter['$gt'] = filters.elo.from;
    }

    if (filters.elo.to) {
      eloFilter['$lte'] = filters.elo.to;
    }

    if (!_.isEmpty(eloFilter)) {
      query['state.elo'] = eloFilter;
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
    UserModel.find(query).exec((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result.map(item => item.toObject()));
    });
  });
};

export const validateUser = (user: unknown) => {
  return new UserModel(user).validateSync();
};

export const hashPassword = (password: string) => {
  return hash(password, parseInt(process.env.SALT_ROUNDS as string));
};

export const validateUserPassword = (user: User, passwordHash: string) => {
  return compare(user.password, passwordHash);
};
