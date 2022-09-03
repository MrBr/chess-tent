import { Middleware } from '@types';
import application from '@application';
import { TYPE_LESSON } from '@chess-tent/models';
import { PUSH_RECORD } from '@chess-tent/redux-record/dist/types';

import { userTrainings } from '../record';

export const middleware: Middleware = store => next => action => {
  if (
    action.type === PUSH_RECORD &&
    action.meta.push &&
    action.payload.value?.subject?.type === TYPE_LESSON
  ) {
    // Normalized records can't be set directly to the redux.
    // Received value is denormalized and has to be normalized first.
    // TODO - find a better way to handle this scenario
    //  probably there should be option to extend record reducer
    const { value } = action.payload;
    const { key } = action.meta;
    userTrainings(key)(store).push(value);
    return;
  }
  next(action);
};

application.state.registerMiddleware(middleware);
