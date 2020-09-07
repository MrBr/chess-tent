import application from "@application";
import { getUser } from "./service";

import "./routes";

application.service.getUser = getUser;

application.register(() => import("./socket"));
