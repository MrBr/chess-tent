import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Components } from '@chess-tent/web/src/application/types';
import { User, TYPE_USER } from '@chess-tent/models';

import { withWebNamespace } from '../../utils';

export default {
  title: 'Components/Zoom',
} as ComponentMeta<Components['ZoomProvider']>;

const redirectUri =
  'https://localhost:6006/?path=/story/components-zoom--default';

const user: User = {
  id: '1',
  coach: true,
  nickname: 'nickname',
  name: 'Nick Name',
  type: TYPE_USER,
  state: {},
};

const guestMeetingNumber = '4785447829';

export const Default: ComponentStory<Components['ZoomProvider']> =
  withWebNamespace(
    'components',
    (
      args,
      {
        ZoomProvider,
        Route,
        Router,
        ZoomActivityView,
        ZoomHostControl,
        ZoomGuestControl,
      },
    ) => {
      return (
        <Router>
          {() => (
            <Route path="/">
              <ZoomProvider redirectUri={redirectUri} user={user}>
                {user?.coach ? (
                  <ZoomHostControl />
                ) : (
                  <ZoomGuestControl meetingNumber={guestMeetingNumber} />
                )}
                <ZoomActivityView />
              </ZoomProvider>
            </Route>
          )}
        </Router>
      );
    },
  );
