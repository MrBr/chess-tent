import application, { middleware } from "@application";
import {
  prepareUser,
  saveUser,
  validateUser,
  loginUser,
  hashPassword,
  getActiveUser
} from "./middleware";
import { getUser } from "./service";

const { sendData, indexEntity, identify } = middleware;

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
  loginUser,
  sendData("token")
);

application.service.registerGetRoute(
  "/me",
  identify,
  getActiveUser,
  sendData("user")
);
