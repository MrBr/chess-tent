export const DEFAULT_CONSTRAINTS = {
  video: {
    facingMode: 'user',
  },
  audio: true,
};
export const DEFAULT_ICE_SERVERS = [
  {
    urls: `turn:${process.env.REACT_APP_TURN_SERVER_IP}:${process.env.REACT_APP_TURN_SERVER_PORT}`,
    username: process.env.REACT_APP_TURN_SERVER_USERNAME as string,
    credential: process.env.REACT_APP_TURN_SERVER_PASSWORD as string,
  },
  {
    urls: `stun:${process.env.REACT_APP_TURN_SERVER_IP}:${process.env.REACT_APP_TURN_SERVER_PORT}`,
    username: process.env.REACT_APP_TURN_SERVER_USERNAME as string,
    credential: process.env.REACT_APP_TURN_SERVER_PASSWORD as string,
  },
];
