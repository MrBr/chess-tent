import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Components } from '@chess-tent/web/src/application/types';
import { TYPE_USER } from '@chess-tent/models';

import { withWebNamespace } from '../../utils';

export default {
  title: 'Components/Zoom',
} as ComponentMeta<Components['ZoomProvider']>;

export const Default: ComponentStory<Components['ZoomProvider']> =
  withWebNamespace(
    'components',
    (
      { user, redirectUri, meetingNumber },
      {
        ZoomProvider,
        Router,
        ZoomActivityView,
        ZoomHostControl,
        ZoomGuestControl,
      },
    ) => {
      return (
        <Router>
          {() => (
            <ZoomProvider
              redirectUri={redirectUri}
              user={user}
              meetingNumber={meetingNumber}
            >
              {user?.coach ? <ZoomHostControl /> : <ZoomGuestControl />}
              <ZoomActivityView />
            </ZoomProvider>
          )}
        </Router>
      );
    },
  );

Default.args = {
  redirectUri: 'https://localhost:6006/?path=/story/components-zoom--default',
  user: {
    id: '1',
    coach: false,
    nickname: 'nickname',
    name: 'Nick Name',
    type: TYPE_USER,
    state: {},
  },
  meetingNumber: '4785447829',
};

Default.argTypes = {
  redirectUri: { control: 'text' },
  meetingNumber: { control: 'text' },
  user: { control: 'object' },
};
