import { Service } from "@types";
import { UserModel } from "./model";
import { User } from "@chess-tent/models";
import { compare, hash } from "bcrypt";

export const addUser = (user: User) =>
  new Promise((resolve, reject) => {
    new UserModel(user).save((err, result) => {
      if (err) {
        throw err;
      }
      resolve(result.toObject() as typeof user);
    });
  });

export const getUser: Service["getUser"] = (user, projection = "") =>
  new Promise((resolve, reject) => {
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

export const validateUser = (user: unknown) => {
  return new UserModel(user).validateSync();
};

export const hashPassword = (password: string) => {
  return hash(password, parseInt(process.env.SALT_ROUNDS as string));
};

export const validateUserPassword = (user: User, passwordHash: string) => {
  return compare(user.password, passwordHash);
};
