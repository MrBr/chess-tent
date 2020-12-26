import { Components } from '@types';
import React from 'react';
import { components, hooks } from '@application';

const { MobilePortal, Redirect, Route } = components;
const { useIsMobile } = hooks;

const MobileRoute: Components['MobileRoute'] = ({
  children,
  redirectRoute = '/',
  ...props
}) => {
  const isMobile = useIsMobile();
  return (
    <Route {...props}>
      {isMobile ? (
        <MobilePortal>{children}</MobilePortal>
      ) : (
        <Redirect to={redirectRoute} />
      )}
    </Route>
  );
};

export default MobileRoute;
