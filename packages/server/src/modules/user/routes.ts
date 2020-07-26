import application, { middleware } from "@application";
import {
  prepareUser,
  saveUser,
  validateUser,
  loginUser,
  hashPassword
} from "./middleware";

const { sendData, indexEntity } = middleware;

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
