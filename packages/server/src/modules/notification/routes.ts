import application, { middleware } from "@application";
import { getNotifications } from "./middleware";

const { identify, sendData, toLocals } = middleware;

application.service.registerGetRoute(
  "/notifications",
  identify,
  toLocals("filters", (req, res) => ({
    user: res.locals.user,
    read: !!req.query.read
  })),
  getNotifications,
  sendData("notifications")
);
