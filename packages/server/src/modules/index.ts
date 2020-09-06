import application from "@application";

application.register(() => import("./app"));
application.register(() => import("./lesson"));
application.register(() => import("./conversation"));
application.register(() => import("./db"));
application.register(() => import("./user"));
application.register(() => import("./auth"));
application.register(() => import("./activity"));
application.register(() => import("./aws"));
