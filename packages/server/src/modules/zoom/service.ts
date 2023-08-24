import axios from 'axios';

import { service } from '@application';
import { User, ZoomRole } from '@chess-tent/models';

import { Authorization } from './constants';
import { ZoomUserTokenModel } from './model';

const authorizeUserByCode = async (
  code: string,
  redirectUri: string,
  user: User,
) => {
  const { refresh_token: refreshToken, access_token: accessToken } = await axios
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
    .then(data => data.data);

  ZoomUserTokenModel.findOneAndUpdate(
    { user: user.id },
    { user: user.id, refreshToken },
    { upsert: true, useFindAndModify: false },
    error => {
      if (error) console.error(error);
    },
  );

  return axios
    .get('https://api.zoom.us/v2/users/me/token?type=zak', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(data => data.data.token);
};

const generateSignature = async (meetingNumber: string, role: ZoomRole) => {
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
