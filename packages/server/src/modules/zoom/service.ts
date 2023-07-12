import axios from 'axios';

import { service } from '@application';

const Authorization = Buffer.from(
  `${process.env.ZOOM_MEETING_SDK_KEY_OR_CLIENT_ID}:${process.env.ZOOM_MEETING_SDK_SECRET_OR_CLIENT_SECRET}`,
).toString('base64');

const authorizeUserByCode = async (code: string, redirectUri: string) => {
  const accessToken = await axios
    .postForm(
      'https://zoom.us/oauth/token',
      {
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      },
      {
        headers: {
          Authorization: `Basic ${Authorization}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
      },
    )
    .then(data => data.data.access_token)
    .catch(console.log);

  return axios
    .get('https://api.zoom.us/v2/users/me/token?type=zak', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(data => data.data.token)
    .catch(console.log);
};

const generateSignature = async (meetingNumber: string, role: number) => {
  const currentTimestamp = Math.round(new Date().getTime() / 1000) - 30;
  const expirationTimestamp = currentTimestamp + 60 * 60 * 2;

  const payload = {
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY_OR_CLIENT_ID,
    mn: meetingNumber,
    role: role,
    iat: currentTimestamp,
    exp: expirationTimestamp,
    tokenExp: expirationTimestamp,
  };

  return service.generateToken(
    payload,
    `${process.env.ZOOM_MEETING_SDK_SECRET_OR_CLIENT_SECRET}`,
  );
};

export { authorizeUserByCode, generateSignature };
