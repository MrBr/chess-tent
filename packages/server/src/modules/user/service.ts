import { NormalizedUser, User } from '@chess-tent/models';
import { WithPagination } from '@chess-tent/types';
import { AppDocument } from '@types';
import { compare, hash } from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { utils, service, db } from '@application';
import { shuffle } from 'lodash';
import { UserModel } from './model';
import { withCoachPublicInfo } from './utils';

const PUBLIC_COACH_NUMBER = 8;

export const addUser = async (user: User): Promise<void> => {
  try {
    await new UserModel(user).save();
  } catch (e) {
    throw new Error('Failed to create user. ' + e);
  }
};

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
  const infoQuery: FilterQuery<AppDocument<NormalizedUser>> =
    utils.notNullOrUndefined({
      coach: true,
      name: filters.name,
    });
  const query: { $and: FilterQuery<AppDocument<NormalizedUser>>[] } = {
    $and: [infoQuery],
  };

  if (filters.studentElo) {
    const rangeQuery: FilterQuery<AppDocument<NormalizedUser>>[] = [];
    query.$and.push({ $or: rangeQuery });
    if (filters.studentElo.from) {
      rangeQuery.push({
        'state.studentEloMin': {
          $gte: filters.studentElo.from,
          $lte: filters.studentElo.to,
        },
      });
    }

    if (filters.studentElo.to) {
      rangeQuery.push({
        'state.studentEloMax': {
          $gte: filters.studentElo.from,
          $lte: filters.studentElo.to,
        },
      });
    }
  }

  // TODO: connect tags to users
  if (filters.speciality) {
    infoQuery['state.speciality'] = { $eq: filters.speciality };
  }

  if (filters.search) {
    infoQuery['$text'] = { $search: filters.search, $caseSensitive: false };
  }

  withCoachPublicInfo(infoQuery);

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

export const getPublicCoaches = async () => {
  const infoQuery: FilterQuery<AppDocument<NormalizedUser>> =
    utils.notNullOrUndefined({
      coach: true,
    });
  const query: { $and: FilterQuery<AppDocument<NormalizedUser>>[] } = {
    $and: [infoQuery],
  };

  withCoachPublicInfo(infoQuery);

  // get full public coaches count
  const coachCount = await UserModel.find(query).countDocuments();

  const coaches = await UserModel.find(query)
    .limit(PUBLIC_COACH_NUMBER)
    .select({
      id: 1,
      name: 1,
      nickname: 1,
      type: 1,
      'state.imageUrl': 1,
      'state.elo': 1,
      'state.studentEloMin': 1,
      'state.studentEloMax': 1,
      'state.teachingMethodology': 1,
      'state.languages': 1,
      'state.punchline': 1,
      'state.country': 1,
      'state.fideTitle': 1,
    });
  // ADD TRY CATCH TO COACHES
  return { coaches: shuffle(coaches), coachCount };
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
