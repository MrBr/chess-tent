// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    createProxyMiddleware('/api', { target: process.env.DEV_SERVER_URL }),
  );
  app.use(
    createProxyMiddleware('/api/socket.io', {
      target: process.env.DEV_SERVER_URL,
      ws: true,
      // Needed to prevent unhandled promise error crash
      onError: err => console.log(`Proxy error: ${err}`),
    }),
  );
};
