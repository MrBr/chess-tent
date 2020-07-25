import { Service } from "@types";
import { UserModel } from "./model";
import { User } from "@chess-tent/models";

export const saveUser = (user: User) =>
  new Promise((resolve, reject) => {
    new UserModel(user).depopulate().save((err, result) => {
      err ? reject(err) : resolve(result.toObject() as typeof user);
    });
  });

export const getUser: Service["getUser"] = user =>
  new Promise((resolve, reject) => {
    UserModel.findOne(user, (err, user) => {
      err ? reject(err) : user ? resolve(user.toObject()) : reject(null);
    });
  });

export const validateUser = (user: unknown) => {
  return new UserModel(user).validateSync();
};
