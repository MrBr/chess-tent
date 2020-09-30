import application, { middleware } from "@application";
import {
  getCoaches,
  getStudents,
  resolveMentorshipRequest,
  requestMentorship
} from "./middleware";

const { identify, sendData, sendStatusOk, toLocals } = middleware;

application.service.registerPostRoute(
  "/mentorship",
  identify,
  toLocals("studentId", req => req.body.studentId),
  toLocals("coachId", req => req.body.coachId),
  requestMentorship,
  sendStatusOk
);

application.service.registerPutRoute(
  "/mentorship",
  identify,
  toLocals("studentId", req => req.body.studentId),
  toLocals("coachId", req => req.body.coachId),
  toLocals("approved", req => req.body.approved),
  resolveMentorshipRequest,
  sendStatusOk
);

application.service.registerGetRoute(
  "/mentorship/:userId/coaches",
  identify,
  toLocals("studentId", req => req.params.userId),
  getCoaches,
  sendData("coaches")
);

application.service.registerGetRoute(
  "/mentorship/:userId/students",
  identify,
  toLocals("coachId", req => req.params.userId),
  getStudents,
  sendData("students")
);
