import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Components } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';
import { userLoader } from '../../loaders';

export default {
  title: 'Components/CoachCard',
} as ComponentMeta<Components['CoachCard']>;

export const Default: ComponentStory<Components['CoachCard']> =
  withWebNamespace('components', (args, { CoachCard }, { user }) => {
    return <CoachCard coach={user} />;
  });

Default.loaders = [userLoader];
