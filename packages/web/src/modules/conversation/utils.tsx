import React from 'react';

const urlRegex = /(https?:\/\/[^\s]+)/g;
const httpRegex = /http:\/\/|https:\/\//;

const appUrl = `${process.env.REACT_APP_PROTOCOL as string}${
  process.env.REACT_APP_DOMAIN as string
}`;

function isLocalRedirect(url: string) {
  return url.search(appUrl) > -1;
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
