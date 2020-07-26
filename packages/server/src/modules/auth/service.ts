import { verify, sign } from "jsonwebtoken";
import { Auth, Service } from "@types";

export const generateApiToken: Service["generateApiToken"] = user => {
  return sign({ user: { id: user.id } }, process.env.SECRET as string);
};

export const verifyToken: Service["verifyToken"] = token => {
  return verify(token, process.env.SECRET as string) as Auth["apiTokenPayload"];
};
