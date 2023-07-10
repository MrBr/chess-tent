import { socket } from '@application';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import https from 'https';

export const generateIndex = () => uuid();

export const startHttpServer = (app: Express) => {
  const server = app.listen(process.env.PORT, () =>
    console.log(`Application started at port: ${process.env.PORT}`),
  );
  socket.init(server);
};

export const startHttpsServer = (app: Express) => {
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
};
