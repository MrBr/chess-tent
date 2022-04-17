import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Button',
} as ComponentMeta<UI['Button']>;

const Template: ComponentStory<UI['Button']> = withWebNamespace(
  'ui',
  (args, { Button }) => <Button {...args} />,
);

export const Primary = Template.bind({});
Primary.args = { children: 'Test' };
