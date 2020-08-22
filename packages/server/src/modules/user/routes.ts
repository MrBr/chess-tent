import application, { middleware } from "@application";
import {
  prepareUser,
  saveUser,
  validateUser,
  verifyUser,
  hashPassword,
  getActiveUser
} from "./middleware";

const { sendData, indexEntity, identify, webLogin } = middleware;

application.service.registerPostRoute(
  "/register",
  validateUser,
  indexEntity,
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
