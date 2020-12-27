import React from 'react';
import { constants } from '@application';
import styled from '@emotion/styled';

const { MOBILE_ROOT_KEY } = constants;

const MobileRoot = styled(({ className }) => (
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
