import mailgun from "mailgun-js";
import { MailData } from "@types";
import { FailedToSendMAil } from "./errors";

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY as string,
  domain: process.env.MAILGUN_DOMAIN as string,
  host: process.env.MAILGUN_API_HOST as string
});

export const sendMail = (data: MailData) =>
  new Promise((resolve, reject) => {
    mg.messages().send(data, function(error, body) {
      if (error) {
        reject(error);
      } else if (!body) {
        reject(new FailedToSendMAil());
      } else {
        resolve(body);
      }
    });
  });
