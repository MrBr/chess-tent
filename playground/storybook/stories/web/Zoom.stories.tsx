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
              meetingNumber={!user?.coach ? meetingNumber : undefined}
            >
              {user?.coach ? <ZoomHostControl /> : <ZoomGuestControl />}
              <ZoomActivityView setZoomMeetingNumberState={() => {}} />
            </ZoomProvider>
          )}
        </Router>
      );
    },
  );

Default.args = {
  redirectUri: 'https://localhost:6006/?path=/story/components-zoom--default',
  meetingNumber: '4785447829',
  user: {
    id: '1',
    coach: true,
    nickname: 'nickname',
    name: 'Nick Name',
    type: TYPE_USER,
    state: {},
  },
};

Default.argTypes = {
  redirectUri: { control: 'text' },
  meetingNumber: {
    control: 'text',
  },
  user: { control: 'object' },
};
