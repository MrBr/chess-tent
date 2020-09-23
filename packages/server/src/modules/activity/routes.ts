import application, { middleware } from "@application";
import {
  canEditActivity,
  getActivity,
  saveActivity,
  findActivities
} from "./middleware";

const { identify, sendData, sendStatusOk, toLocals } = middleware;

application.service.registerPostRoute(
  "/activity/save",
  identify,
  toLocals("activity", req => req.body),
  canEditActivity,
  saveActivity,
  sendStatusOk
);

application.service.registerPostRoute(
  "/activities",
  identify,
  toLocals("filters", req => [
    { owner: req.body.owner },
    { users: req.body.users },
    { subject: req.body.subject }
  ]),
  findActivities,
  sendData("activities")
);

application.service.registerGetRoute(
  "/activity/:activityId",
  identify,
  toLocals("activity.id", req => req.params.activityId),
  getActivity,
  canEditActivity,
  sendData("activity")
);
