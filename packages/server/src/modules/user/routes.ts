import application from "@application";
import { saveUser, sendUser, validateUser } from "./middleware";

application.service.registerPostRoute(
  "/register",
  validateUser,
  application.middleware.indexEntity,
  saveUser,
  sendUser
);
