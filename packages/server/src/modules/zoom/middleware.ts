import { MiddlewareFunction } from '@types';
import * as zoomService from './service';

const authorizeUserByCode: MiddlewareFunction = async (req, res, next) => {
  const data = await zoomService.authorizeUserByCode(
    res.locals.code,
    res.locals.redirectUri,
  );
  res.locals.data = data;
  next();
};

const generateSignature: MiddlewareFunction = async (req, res, next) => {
  const data = await zoomService.generateSignature(
    res.locals.meetingNumber,
    res.locals.role,
  );
  res.locals.data = data;
  next();
};

export { authorizeUserByCode, generateSignature };
