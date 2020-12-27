import React from 'react';
import { hooks } from '@application';
import { HOC } from '@types';

export const withMobile: HOC['withMobile'] = (
  DesktopComponent,
  MobileComponent,
) => {
  return props => {
    const isMobile = hooks.useIsMobile();
    return isMobile ? (
      <MobileComponent {...props} />
    ) : (
      <DesktopComponent {...props} />
    );
  };
};
