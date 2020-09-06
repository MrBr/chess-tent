import { Service } from "@types";
import { UserModel } from "./model";
import { User } from "@chess-tent/models";
import { compare, hash } from "bcrypt";

export const addUser = (user: User) =>
  new Promise(resolve => {
    new UserModel(user).save((err, result) => {
      if (err) {
        throw err;
      }
      resolve(result.toObject() as typeof user);
    });
  });

export const updateUser = (userId: User["id"], user: Partial<User>) =>
  new Promise(resolve => {
    UserModel.updateOne({ _id: user.id }, { $set: user }).exec(
      (err, result) => {
        if (err) {
          throw err;
        }
        resolve();
      }
    );
  });

export const getUser: Service["getUser"] = (user, projection = "") =>
  new Promise(resolve => {
    UserModel.findOne(
      UserModel.translateAliases(user),
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
  filters: Partial<Pick<User, "coach" | "name">>
): Promise<User[]> =>
  new Promise(resolve => {
    UserModel.find(filters).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve(result.map(item => item.toObject()));
    });
  });

export const validateUser = (user: unknown) => {
  return new UserModel(user).validateSync();
};

export const hashPassword = (password: string) => {
  return hash(password, parseInt(process.env.SALT_ROUNDS as string));
};

export const validateUserPassword = (user: User, passwordHash: string) => {
  return compare(user.password, passwordHash);
};
