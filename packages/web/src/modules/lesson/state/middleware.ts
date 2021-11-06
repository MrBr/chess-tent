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
    // Intercept server push action and handle it through the record
    // TODO - probably using the action it self to trigger
    const { value } = action.payload;
    const { key } = action.meta;
    userTrainings(store, key).push(value);
    return;
  }
  next(action);
};

application.state.registerMiddleware(middleware);
