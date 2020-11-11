import application, { middleware } from "@application";
import {
  addUser,
  validateUser,
  verifyUser,
  hashPassword,
  updateUser,
  findUsers,
  getUser
} from "./middleware";

const {
  sendData,
  identify,
  webLogin,
  webLogout,
  toLocals,
  sendStatusOk
} = middleware;

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

application.service.registerPostRoute(
  "/users",
  identify,
  toLocals("filters", req => req.body),
  findUsers,
  sendData("users")
);

application.service.registerGetRoute("/logout", webLogout, sendStatusOk);

application.service.registerGetRoute(
  "/me",
  identify,
  toLocals("user", (req, res) => res.locals.me),
  getUser,
  sendData("user")
);

application.service.registerGetRoute(
  "/user/:userId",
  identify,
  toLocals("user.id", req => req.params.userId),
  getUser,
  sendData("user")
);

application.service.registerPutRoute(
  "/me",
  identify,
  toLocals("user", (req, res) => ({ ...req.body, ...res.locals.me })),
  updateUser,
  sendStatusOk
);
