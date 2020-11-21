import { UserModel } from "./model";
import { User } from "@chess-tent/models";
import { compare, hash } from "bcrypt";
import { MongooseFilterQuery } from "mongoose";
import { utils } from "@application";

export const addUser = (user: User) =>
  new Promise((resolve) => {
    new UserModel(user).save((err, result) => {
      if (err) {
        throw err;
      }
      resolve(result.toObject() as typeof user);
    });
  });

export const updateUser = (userId: User["id"], user: Partial<User>) =>
  new Promise((resolve) => {
    UserModel.updateOne({ _id: user.id }, { $set: user }).exec(
      (err, result) => {
        if (err) {
          throw err;
        }
        resolve();
      }
    );
  });

export const getUser = (
  userDescr: Partial<User>,
  projection = ""
): Promise<User | null> =>
  new Promise(resolve => {
    UserModel.findOne(
      UserModel.translateAliases(userDescr),
      projection,
      (err, user) => {
        if (err) {
          throw err;
        }
        resolve(user ? user.toObject() : null);
      }
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
  }>
): Promise<User[]> => {
  const query: MongooseFilterQuery<any> = utils.notNullOrUndefined({
    coach: filters.coach,
    name: filters.name,
  });

  if (filters.elo) {
    const eloFilter: { $gt?: number; $lte?: number } = {};
    if (filters.elo.from) {
      eloFilter["$gt"] = filters.elo.from;
    }

    if (filters.elo.to) {
      eloFilter["$lte"] = filters.elo.to;
    }

    if (!_.isEmpty(eloFilter)) {
      query["state.elo"] = eloFilter;
    }
  }

  if (filters.speciality) {
    query["state.speciality"] = { $eq: filters.speciality };
  }

  if (filters.search) {
    query["$text"] = { $search: filters.search, $caseSensitive: false };
  }

  return new Promise((resolve) => {
    UserModel.find(query).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve(result.map((item) => item.toObject()));
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
