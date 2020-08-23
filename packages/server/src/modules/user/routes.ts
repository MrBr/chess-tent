import application, { middleware } from "@application";
import {
  addUser,
  validateUser,
  verifyUser,
  hashPassword,
  getActiveUser
} from "./middleware";

const { sendData, identify, webLogin, toLocals } = middleware;

application.service.registerPostRoute(
  "/register",
  toLocals("user", req => req.body),
  validateUser,
  hashPassword,
  addUser,
  sendData("user")
);

application.service.registerPostRoute(
  "/login",
  toLocals("user", req => req.body),
  verifyUser,
  webLogin,
  sendData("user")
);

application.service.registerGetRoute(
  "/me",
  identify,
  getActiveUser,
  sendData("user")
);
