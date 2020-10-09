import application, { middleware } from "@application";
import { findTags, getAll } from "./middleware";

const { identify, sendData, toLocals } = middleware;

application.service.registerGetRoute(
  "/tags",
  identify,
  getAll,
  sendData("tags")
);

application.service.registerPostRoute(
  "/tags",
  identify,
  toLocals("startsWith", req => req.body),
  findTags,
  sendData("tags")
);
