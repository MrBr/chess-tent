import { v4 as uuid } from 'uuid';

export const generateIndex = () => uuid();

export const getCorsOrigin = () =>
  !!process.env.STORYBOOK_URL
    ? [`${process.env.APP_DOMAIN}`, `${process.env.STORYBOOK_URL}`]
    : `${process.env.APP_DOMAIN}`;
