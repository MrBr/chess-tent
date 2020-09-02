import React from 'react';
import { Components } from '@types';
import { hooks } from '@application';

export const Authorized: Components['Authorized'] = ({ children }) => {
  const authorized = !!hooks.useActiveUserRecord()[0];
  return (
    <>
      {typeof children === 'function'
        ? children(authorized)
        : authorized
        ? children
        : null}
    </>
  );
};
