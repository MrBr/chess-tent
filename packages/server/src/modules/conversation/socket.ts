import { socket } from "@application";
import { ACTION_EVENT, SEND_MESSAGE } from "@chess-tent/types";
import { addMessageToConversation, getConversation } from "./service";

socket.registerMiddleware(async (stream, next) => {
  if (stream.event === ACTION_EVENT && stream.data.type === SEND_MESSAGE) {
    const action = stream.data;
    const conversation = await getConversation(action.meta.conversationId);
    addMessageToConversation(conversation.id, action.payload);
    conversation.users.forEach(user => {
      user.id !== action.payload.owner &&
        socket.sendAction(`user-${user.id}`, action);
    });
  }
  next(stream);
});
