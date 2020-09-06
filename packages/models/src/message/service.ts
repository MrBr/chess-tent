import { User } from "../user";
import { Message, TYPE_MESSAGE } from "./types";

const createMessage = (id: string, owner: User, message: string): Message => ({
  id,
  type: TYPE_MESSAGE,
  owner,
  message,
  timestamp: Date.now()
});

export { createMessage };
