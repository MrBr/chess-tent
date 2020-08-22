import application, { middleware } from "@application";
import {
  prepareUser,
  saveUser,
  validateUser,
  verifyUser,
  hashPassword,
  getActiveUser
} from "./middleware";

const { sendData, identify, webLogin } = middleware;

application.service.registerPostRoute(
  "/register",
  validateUser,
  prepareUser,
  hashPassword,
  saveUser,
  sendData("user")
);

application.service.registerPostRoute(
  "/login",
  prepareUser,
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
