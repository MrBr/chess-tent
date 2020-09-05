import { User } from "../user";

export const TYPE_MESSAGE = "messages";

export interface Message {
  id: string;
  message: string;
  owner: User;
  timestamp: string;
  type: typeof TYPE_MESSAGE;
}

export interface NormalizedMessage {
  id: string;
  message: string;
  owner: User["id"];
  timestamp: string;
  type: typeof TYPE_MESSAGE;
}
