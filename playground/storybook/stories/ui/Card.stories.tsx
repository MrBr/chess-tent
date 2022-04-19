import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Card',
} as ComponentMeta<UI['CardEmpty']>;

const Template: ComponentStory<UI['CardEmpty']> = withWebNamespace(
  'ui',
  (args, { CardEmpty }) => <CardEmpty {...args} />,
);
export const CardEmpty = Template.bind({});
CardEmpty.args = {
  title: 'Best way to start',
  subtitle: 'Browse the coaches',
  cta: 'Find a coach',
};
