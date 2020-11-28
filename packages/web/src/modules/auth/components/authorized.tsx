import React from 'react';
import { Components } from '@types';
import { hooks, components } from '@application';

const { Redirect } = components;

export const Authorized: Components['Authorized'] = ({ children }) => {
  const authorized = !!hooks.useActiveUserRecord()[0];

  if (typeof children === 'function') {
    return children(authorized);
  }

  return <>{authorized ? children : <Redirect to="/" />}</>;
};
