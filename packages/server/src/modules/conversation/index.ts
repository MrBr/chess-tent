import application from "@application";
import "./routes";

application.register(() => import("./socket"));
