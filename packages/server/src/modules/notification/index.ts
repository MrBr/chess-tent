import application from "@application";
import { createNotification, sendNotification } from "./middleware";

import "./routes";

application.middleware.sendNotification = sendNotification;
application.middleware.createNotification = createNotification;
