import { constants } from '@application';
import React from 'react';

const urlRegex = /(https?:\/\/[^\s]+)/g;
const httpRegex = /http:\/\/|https:\/\//;

const { APP_URL } = constants;

function isLocalRedirect(url: string) {
  return url.search(APP_URL) > -1;
}

export const formatMessageLinks = (message: string) =>
  message.split(urlRegex).map((str, index) =>
    index % 2 === 1 ? (
      <a
        href={str}
        key={`${str}${index}`}
        target={isLocalRedirect(str) ? '_self' : '_blank'}
        rel="noreferrer"
      >
        {str.replace(httpRegex, '')}
      </a>
    ) : (
      str
    ),
  );
