import React from 'react';
import { Components } from '@types';
import { hooks } from '@application';

export const Authorized: Components['Authorized'] = ({ children }) => {
  const authorized = !!hooks.useActiveUser();
  return (
    <>{typeof children === 'function' ? children(authorized) : children}</>
  );
};
