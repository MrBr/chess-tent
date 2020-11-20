import application, { middleware } from "@application";
import {
  getCoaches,
  getStudents,
  resolveMentorshipRequest,
  requestMentorship
} from "./middleware";
import { TYPE_MENTORSHIP } from "@chess-tent/models";

const {
  identify,
  sendData,
  sendStatusOk,
  toLocals,
  sendNotification,
  createNotification
} = middleware;

application.service.registerPostRoute(
  "/mentorship",
  identify,
  toLocals("studentId", req => req.body.studentId),
  toLocals("coachId", req => req.body.coachId),
  requestMentorship,

  // Notification flow
  toLocals("user", (req, res) => res.locals.mentorship.coach),
  toLocals("notificationType", TYPE_MENTORSHIP),
  toLocals("state", (req, res) => ({
    text: `${res.locals.mentorship.student.name} requested mentorship`,
    student: res.locals.mentorship.student.id
  })),
  createNotification,
  sendNotification,

  sendData("mentorship")
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
