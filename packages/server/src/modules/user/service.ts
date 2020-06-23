import { Service } from "@types";
import { UserModel } from "./model";

export const getUser: Service["getUser"] = user => {
  return new Promise((resolve, reject) => {
    UserModel.findOne(user, (err, user) => {
      err ? reject(err) : user ? resolve(user.toObject()) : reject(null);
    });
  });
};
