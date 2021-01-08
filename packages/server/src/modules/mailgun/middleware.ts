import { Middleware } from '@types';
import { sendMail as sendMailService } from './service';

export const sendMail: Middleware['sendMail'] = formatData => (
  res,
  req,
  next,
) => {
  const data = formatData(res, req);
  sendMailService(data)
    .then(() => next())
    .catch(next);
};
