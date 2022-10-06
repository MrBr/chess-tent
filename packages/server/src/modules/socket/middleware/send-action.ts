import application from '@application';
import { MiddlewareFunction } from '@types';
import * as service from '../service';

export const sendAction: MiddlewareFunction = async (req, res, next) => {
  try {
    if (!res.locals.action?.channel || !res.locals.action?.data) {
      console.warn(
        'Send action middleware called but action not prepared in locals.',
        res.locals.action,
      );
      next();
      return;
    }
    const { data, channel } = res.locals.action;
    console.log(channel);
    service.sendServerAction(channel, data);
    next();
  } catch (e) {
    next(e);
  }
};

application.middleware.sendAction = sendAction;
