export interface RTC_CONSTRAINTS {
  audio: boolean;
  video?: {};
}

export const DEFAULT_CONSTRAINTS_DESKTOP = {
  video: {
    facingMode: 'user',
  },
  audio: true,
};
export const DEFAULT_CONSTRAINTS_MOBILE = {
  audio: true,
};
export const DEFAULT_ICE_SERVERS = [
  {
    urls: process.env.REACT_APP_TURN_SERVER_URL as string,
    username: process.env.REACT_APP_TURN_SERVER_USERNAME as string,
    credential: process.env.REACT_APP_TURN_SERVER_PASSWORD as string,
  },
];
