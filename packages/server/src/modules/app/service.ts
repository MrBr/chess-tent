import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import https from 'https';

export const generateIndex = () => uuid();

export const getCorsOrigin = () =>
  !!process.env.STORYBOOK_URL
    ? [`${process.env.APP_DOMAIN}`, `${process.env.STORYBOOK_URL}`]
    : `${process.env.APP_DOMAIN}`;

export const startHttpServer = (app: Express) =>
  app.listen(process.env.PORT, () =>
    console.log(`Application started at port: ${process.env.PORT}`),
  );

export const startHttpsServer = (app: Express) =>
  https
    .createServer(
      {
        key: fs.readFileSync(`${process.env.SSL_KEY_PATH}`),
        cert: fs.readFileSync(`${process.env.SSL_CERT_PATH}`),
      },
      app,
    )
    .listen(process.env.PORT, () => {
      console.log(`HTTPS is running at port: ${process.env.PORT}`);
    });
