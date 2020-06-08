import { service } from "@application";
import { generateToken, verifyToken } from "./service";

service.verifyToken = verifyToken;
service.generateToken = generateToken;
