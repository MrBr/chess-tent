import { middleware, service } from "@application";
import { generateToken, verifyToken } from "./service";
import { identify } from "./middleware";

service.verifyToken = verifyToken;
service.generateToken = generateToken;
middleware.identify = identify;
