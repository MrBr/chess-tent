import mailgun from 'mailgun-js';
import { MailData } from '@types';
import { FailedToSendMAil } from './errors';

console.warn(
  'ADD A LIFECYCLE STEP FOR INITIALISING ASYNC SERVICES - SEE TODO BELLOW',
);

export const sendMail = async (
  data: MailData,
): Promise<mailgun.messages.SendResponse | FailedToSendMAil | unknown> => {
  // TODO - move to a lifecycle step
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY || ('' as string),
    domain: process.env.MAILGUN_DOMAIN || ('' as string),
    host: process.env.MAILGUN_API_HOST || ('' as string),
  });

  try {
    const response = mg.messages().send(data);
    if (!response) {
      throw new FailedToSendMAil();
    }
    return response;
  } catch (e) {
    return e;
  }
};
