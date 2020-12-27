import React from 'react';
import { components } from '@application';
import Conversations from '../components/conversations';

const { MobileScreen } = components;

export default () => {
  return (
    <MobileScreen>
      <Conversations />
    </MobileScreen>
  );
};
