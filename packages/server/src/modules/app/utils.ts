export const formatAppLink = (path: string) =>
  `${process.env.APP_DOMAIN}${path}`;

export const shouldStartHttpsServer = (): boolean =>
  !!process.env.SSL_KEY_PATH && !!process.env.SSL_CERT_PATH;
