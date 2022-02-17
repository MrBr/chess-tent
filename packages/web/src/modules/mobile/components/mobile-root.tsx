import React from 'react';
import { constants } from '@application';
import styled from '@emotion/styled';
import { UIComponent } from '@types';

const { MOBILE_ROOT_KEY } = constants;

const MobileRoot = styled<UIComponent>(({ className }) => (
  <div id={MOBILE_ROOT_KEY} className={`${MOBILE_ROOT_KEY} ${className}`} />
))({
  '&:empty': {
    display: 'none',
  },
  position: 'fixed',
  height: '100vh',
  width: '100vw',
  zIndex: 1000,
  background: '#fff',
});

export default MobileRoot;
