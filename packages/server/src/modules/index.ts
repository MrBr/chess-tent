import application from "@application";

application.register(() => import("./app"));
application.register(() => import("./lesson"));
application.register(() => import("./db"));
application.register(() => import("./subject"));
application.register(() => import("./user"));
application.register(() => import("./auth"));
