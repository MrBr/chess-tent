// TODO - find a better way to mock env variables in test environment
// @ts-ignore
process.env.REACT_APP_URL = 'http://localhost:3000';
process.env.REACT_APP_API_URL = 'https://localhost:3007/api';
process.env.REACT_APP_SOCKET_URL = 'https://localhost:3007/api/socket.io';
