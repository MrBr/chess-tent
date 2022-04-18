import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Components } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';
import { trainingLoader } from '../../loaders';

export default {
  title: 'Components/TrainingCard',
} as ComponentMeta<Components['TrainingCard']>;

export const Default: ComponentStory<Components['TrainingCard']> =
  withWebNamespace('components', (args, { TrainingCard }, { training }) => {
    return <TrainingCard training={training} />;
  });

Default.loaders = [trainingLoader];
