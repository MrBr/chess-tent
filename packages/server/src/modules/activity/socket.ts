import { socket } from "@application";
import {
  ACTION_EVENT,
  UPDATE_ACTIVITY_STATE,
  SUBSCRIBE_EVENT,
  UPDATE_ACTIVITY,
  SET_ACTIVITY_ACTIVE_STEP
} from "@chess-tent/types";
import { canEditActivity, getActivity } from "./service";
import { Auth } from "@types";

socket.registerMiddleware(async (stream, next) => {
  // Handle activity channel subscription
  if (
    stream.event === SUBSCRIBE_EVENT &&
    stream.data?.indexOf("activity") > -1
  ) {
    const tokenData = socket.identify(stream);
    if (!tokenData) {
      console.log("Unauthorized socket subscribe");
      return;
    }
    const [prefix, activityId] = stream.data.split("-");
    const canJoin = await canEditActivity(activityId, tokenData.user.id);
    if (canJoin) {
      console.log("Client joined to", stream.data);
      stream.client.join(stream.data);
    }
  }
  // Forward activity action
  if (
    stream.event === ACTION_EVENT &&
    (stream.data.type === UPDATE_ACTIVITY_STATE ||
      stream.data.type === SET_ACTIVITY_ACTIVE_STEP ||
      stream.data.type === UPDATE_ACTIVITY)
  ) {
    const action = stream.data;
    socket.sendAction(`activity-${action.meta.id}`, stream);
  }

  next(stream);
});
