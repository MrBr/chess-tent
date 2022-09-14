import React from 'react';

const urlRegex = /(https?:\/\/[^\s]+)/g;
const httpRegex = /http:\/\/|https:\/\//;

export const formatMessageLinks = (message: string) =>
  message.split(urlRegex).map((str, index) =>
    index % 2 === 1 ? (
      <a href={str} key={`${str}${index}`} target="_blank" rel="noreferrer">
        {str.replace(httpRegex, '')}
      </a>
    ) : (
      str
    ),
  );
