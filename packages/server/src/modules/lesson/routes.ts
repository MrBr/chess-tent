import application, { middleware } from "@application";
import { canEditLesson, saveLesson } from "./middleware";

const { identify, sendData } = middleware;

application.service.registerGetRoute("/lesson/all", (req, res) => {
  res.send("All lessons!");
});

application.service.registerPostRoute(
  "/lesson/save",
  identify,
  canEditLesson,
  saveLesson,
  sendData("lesson")
);
