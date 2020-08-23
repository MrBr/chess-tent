import application, { middleware } from "@application";
import { canEditLesson, getLesson, saveLesson } from "./middleware";

const { identify, sendData, sendStatusOk, toLocals } = middleware;

application.service.registerGetRoute("/lesson/all", (req, res) => {
  res.send("All lessons!");
});

application.service.registerPostRoute(
  "/lesson/save",
  identify,
  toLocals("lesson", req => req.body),
  canEditLesson,
  saveLesson,
  sendStatusOk
);

application.service.registerGetRoute(
  "/lesson/:lessonId",
  identify,
  toLocals("lesson.id", req => req.params.lessonId),
  getLesson,
  canEditLesson,
  sendData("lesson")
);
