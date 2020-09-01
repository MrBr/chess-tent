import application, { middleware } from "@application";
import {
  canEditLesson,
  getLesson,
  saveLesson,
  findLessons,
  patchLesson
} from "./middleware";

const { identify, sendData, sendStatusOk, toLocals } = middleware;

application.service.registerPostRoute(
  "/lesson/save",
  identify,
  toLocals("lesson", req => req.body),
  canEditLesson,
  saveLesson,
  sendStatusOk
);
application.service.registerPutRoute(
  "/lesson/:id",
  identify,
  toLocals("lesson", req => req.body),
  toLocals("lesson.id", req => req.params.id),
  canEditLesson,
  patchLesson,
  sendStatusOk
);

application.service.registerPostRoute(
  "/lessons",
  identify,
  toLocals("filters", req => ({ owner: req.body.owner })),
  findLessons,
  sendData("lessons")
);

application.service.registerGetRoute(
  "/lesson/:lessonId",
  identify,
  toLocals("lesson.id", req => req.params.lessonId),
  getLesson,
  canEditLesson,
  sendData("lesson")
);
