import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Components } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'Components/Zoom',
} as ComponentMeta<Components['ZoomProvider']>;

const redirectUri =
  'https://localhost:6006/?path=/story/components-zoom--default';

export const Default: ComponentStory<Components['ZoomProvider']> =
  withWebNamespace('components', (args, { ZoomProvider, Route, Router }) => {
    return (
      <Router>
        {() => (
          <Route path="/">
            <ZoomProvider room="" redirectUri={redirectUri} />
          </Route>
        )}
      </Router>
    );
  });
