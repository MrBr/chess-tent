// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(createProxyMiddleware('/api', { target: 'http://localhost:3007' }));
  app.use(
    createProxyMiddleware('/api/socket.io', {
      target: 'http://localhost:3007',
      ws: true,
      // Needed to prevent unhandled promise error crash
      onError: err => console.log(`Proxy error: ${err}`),
    }),
  );
};
