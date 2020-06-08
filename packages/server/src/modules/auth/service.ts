import { verify, sign } from "jsonwebtoken";
import { Service } from "@types";

export const generateToken: Service["generateToken"] = payload => {
  return sign(payload, process.env.SECRET as string);
};

export const verifyToken = <T extends {}>(token: string) => {
  return verify(token, process.env.SECRET as string) as T;
};
