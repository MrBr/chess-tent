import { User } from "../user";

export const TYPE_MESSAGE = "messages";

export interface Message {
  id: string;
  message: string;
  owner: User["id"];
  timestamp: number;
  type: typeof TYPE_MESSAGE;
}

export interface NormalizedMessage {
  id: Message["id"];
  message: Message["message"];
  owner: User["id"];
  timestamp: Message["timestamp"];
  type: typeof TYPE_MESSAGE;
}
