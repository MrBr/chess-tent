import application from "@application";
import { hashPassword, saveUser, sendUser, validateUser } from "./middleware";

application.service.registerPostRoute(
  "/register",
  validateUser,
  application.middleware.indexEntity,
  hashPassword,
  saveUser,
  sendUser
);
