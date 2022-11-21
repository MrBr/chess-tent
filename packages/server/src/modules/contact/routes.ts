import application, { middleware } from '@application';
import { ContactParams } from '@chess-tent/types';

import { MissingContactDetailsError } from './errors';

const { sendStatusOk, sendMail, validate } = middleware;

application.service.registerPostRoute(
  '/contact',
  validate(req => {
    const { email, name, message } = req.body as ContactParams;
    if (!email || !name || !message) {
      throw new MissingContactDetailsError();
    }
    if (!process.env.CONTACT_EMAIL) {
      throw new Error('Missing contact email.');
    }
    return true;
  }),
  sendMail((req, res) => ({
    from: `${req.body.name} <${req.body.email}>`,
    to: process.env.CONTACT_EMAIL as string,
    subject: 'Contact form message',
    html: `<p>${req.body.name} sent a message:</p> 
      <p>${req.body.message}</p>`,
  })),
  sendStatusOk,
);
