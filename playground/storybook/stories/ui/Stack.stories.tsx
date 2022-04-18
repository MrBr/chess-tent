import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Stack',
} as ComponentMeta<UI['Stack']>;

const Template: ComponentStory<UI['Stack']> = withWebNamespace(
  'ui',
  (args, { Stack }) => (
    <Stack {...args}>
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </Stack>
  ),
);

export const Default = Template.bind({});
