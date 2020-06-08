import { Service } from "@types";
import { service } from "@application";
import { UserModel } from "./model";
import { User } from "@chess-tent/models";

export const getUser: Service["getUser"] = user => {
  return new Promise((resolve, reject) => {
    UserModel.findOne(user, (err, user) => {
      err ? reject(err) : user ? resolve(user.toObject()) : reject(null);
    });
  });
};

export const identifyUser: Service["identifyUser"] = async token => {
  return service.verifyToken<User>(token);
};

export const generateUserToken: Service["generateToken"] = user => {
  return service.generateToken(user);
};
