import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Components } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';
import { lessonLoader } from '../../loaders';

export default {
  title: 'Components/LessonCard',
} as ComponentMeta<Components['LessonCard']>;

export const Default: ComponentStory<Components['LessonCard']> =
  withWebNamespace('components', (args, { LessonCard }, { lesson }) => {
    return <LessonCard lesson={lesson} />;
  });

Default.loaders = [lessonLoader];
