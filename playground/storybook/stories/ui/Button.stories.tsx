import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '@chess-tent/web/src/modules/ui/Button';

export default {
  title: 'UI/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = { children: 'Test' };
