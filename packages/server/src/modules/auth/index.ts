import { middleware, service } from "@application";
import { generateApiToken, verifyToken } from "./service";
import { identify } from "./middleware";

service.verifyToken = verifyToken;
service.generateApiToken = generateApiToken;
middleware.identify = identify;
