import { MiddlewareFunction } from '@types';
import * as zoomService from './service';

const authorizeUserByCode: MiddlewareFunction = async (req, res, next) => {
  const data = await zoomService.authorizeUserByCode(
    res.locals.zoom.code,
    res.locals.zoom.redirectUri,
  );
  res.locals.zoomAuthorization = data;
  next();
};

const generateSignature: MiddlewareFunction = async (req, res, next) => {
  const data = await zoomService.generateSignature(
    res.locals.zoom.meetingNumber,
    res.locals.zoom.role,
  );
  res.locals.zoomSignature = data;
  next();
};

export { authorizeUserByCode, generateSignature };
