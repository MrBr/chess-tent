import application, { middleware } from "@application";
import { findTags } from "./middleware";

const { identify, sendData, toLocals } = middleware;

application.service.registerPostRoute(
  "/tags",
  identify,
  toLocals("startsWith", req => req.body),
  findTags,
  sendData("tags")
);
