import { verify, sign } from 'jsonwebtoken';
import { Auth, Service } from '@types';

export const generateToken: Service['generateToken'] = (
  payload,
  secret,
  options,
) => {
  return sign(payload, secret, options);
};

export const verifyToken: Service['verifyToken'] = <T extends {}>(
  token: string,
  secret: string,
) => {
  return verify(token, secret) as T;
};

export const generateApiToken: Service['generateApiToken'] = user => {
  return generateToken(
    { user: { id: user.id } },
    process.env.TOKEN_SECRET as string,
  );
};

export const verifyApiToken: Service['verifyApiToken'] = token => {
  if (!token) {
    return null;
  }
  return verify(
    token,
    process.env.TOKEN_SECRET as string,
  ) as Auth['apiTokenPayload'];
};
