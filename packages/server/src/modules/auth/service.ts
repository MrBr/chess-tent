import { verify, sign } from 'jsonwebtoken';
import { Auth, Service } from '@types';

export const generateApiToken: Service['generateApiToken'] = user => {
  return sign({ user: { id: user.id } }, process.env.TOKEN_SECRET as string);
};

export const verifyToken: Service['verifyToken'] = token => {
  if (!token) {
    return null;
  }
  return (
    (verify(
      token,
      process.env.TOKEN_SECRET as string,
    ) as Auth['apiTokenPayload']) || null
  );
};
