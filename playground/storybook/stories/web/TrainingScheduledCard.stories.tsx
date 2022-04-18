import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Components } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';
import { trainingLoader } from '../../loaders';

export default {
  title: 'Components/TrainingScheduledCard',
} as ComponentMeta<Components['TrainingScheduledCard']>;

export const Default: ComponentStory<Components['TrainingScheduledCard']> =
  withWebNamespace(
    'components',
    (args, { TrainingScheduledCard }, { training }) => {
      return <TrainingScheduledCard training={training} />;
    },
  );

Default.loaders = [trainingLoader];
