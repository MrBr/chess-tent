import React from 'react';
import { components } from '@application';
import Conversations from '../components/conversations';

const { MobileScreen } = components;

const PageConversations = () => {
  return (
    <MobileScreen>
      <Conversations />
    </MobileScreen>
  );
};

export default PageConversations;
