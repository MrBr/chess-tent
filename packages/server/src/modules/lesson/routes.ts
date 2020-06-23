import application, { middleware } from "@application";
import { canEditLesson, saveLesson, sendLesson } from "./middleware";

const { identify } = middleware;

application.service.registerGetRoute("/lesson/all", (req, res) => {
  res.send("All lessons!");
});

application.service.registerPostRoute(
  "/lesson/save",
  identify,
  canEditLesson,
  saveLesson,
  sendLesson
);
