import { verify, sign } from "jsonwebtoken";
import { Auth, Service } from "@types";

export const generateToken: Service["generateToken"] = payload => {
  return sign(payload, process.env.SECRET as string);
};

export const verifyToken: Service["verifyToken"] = token => {
  return verify(token, process.env.SECRET as string) as Auth["tokenPayload"];
};
