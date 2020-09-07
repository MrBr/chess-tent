import { User } from "../user";
import { Message, NormalizedMessage, TYPE_MESSAGE } from "./types";

const createMessage = (id: string, owner: User, message: string): Message => ({
  id,
  type: TYPE_MESSAGE,
  owner: owner.id,
  message,
  timestamp: Date.now()
});

export { createMessage };
