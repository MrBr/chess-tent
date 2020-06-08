import application from "@application";
import { identifyUser, generateUserToken, getUser } from "./service";

application.service.getUser = getUser;
application.service.generateUserToken = generateUserToken;
application.service.identifyUser = identifyUser;
