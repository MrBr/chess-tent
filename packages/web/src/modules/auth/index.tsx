import React from 'react';
import application, { hooks } from '@application';
import { Components } from '@types';

const Authorized: Components['Authorized'] = ({ children }) => {
  const authorized = !!hooks.useActiveUser();
  return (
    <>{typeof children === 'function' ? children(authorized) : children}</>
  );
};

application.components.Authorized = Authorized;
