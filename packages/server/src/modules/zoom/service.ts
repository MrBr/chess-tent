import axios from 'axios';

import { service } from '@application';
import { User, ZoomRole } from '@chess-tent/models';

import { Authorization } from './constants';
import { ZoomUserTokenModel } from './model';
import { ZoomTokenNotFoundError } from './errors';

const updateZoomUserRefreshToken = (userId: string, refreshToken: string) =>
  ZoomUserTokenModel.findOneAndUpdate(
    { user: userId },
    { user: userId, refreshToken, updatedAt: new Date() },
    { upsert: true, useFindAndModify: false },
    (err, result) => {
      if (err) {
        throw err;
      }
    },
  );

const getNewAccessToken = async (userId: string, refreshToken: string) => {
  const { access_token: accessToken, refresh_token: newRefreshToken } =
    await axios
      .post(
        'https://zoom.us/oauth/token',
        {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
        {
          headers: {
            Authorization: `Basic ${Authorization}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(data => data.data);

  updateZoomUserRefreshToken(userId, newRefreshToken);

  return accessToken;
};

const getZakToken = async ({
  accessToken,
  user,
}: {
  accessToken?: string;
  user?: User;
}) => {
  if (!accessToken && user) {
    const result = await ZoomUserTokenModel.findOne({ user: user.id }).then(
      result => result?.toObject(),
    );

    if (!result?.refreshToken) {
      throw new ZoomTokenNotFoundError();
    }

    accessToken = await getNewAccessToken(user.id, result.refreshToken);
  }

  return axios
    .get('https://api.zoom.us/v2/users/me/token?type=zak', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(data => data.data.token);
};

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

  updateZoomUserRefreshToken(user.id, refreshToken);

  return getZakToken({ accessToken });
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

export { authorizeUserByCode, generateSignature, getZakToken };
