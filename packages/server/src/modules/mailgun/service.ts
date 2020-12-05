import mailgun from "mailgun-js";
import { MailData } from "@types";

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY as string,
  domain: process.env.MAILGUN_DOMAIN as string
});

export const sendMail = (data: MailData) =>
  new Promise((resolve, reject) => {
    mg.messages().send(data, function(error, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
