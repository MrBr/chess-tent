import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/ToggleButton',
} as ComponentMeta<UI['ToggleButton']>;

const Template: ComponentStory<UI['ToggleButton']> = withWebNamespace(
  'ui',
  (args, { ToggleButton, ButtonGroup }) => (
    <ButtonGroup>
      <ToggleButton>Left</ToggleButton>
      <ToggleButton checked>Mid</ToggleButton>
      <ToggleButton>Right</ToggleButton>
    </ButtonGroup>
  ),
);

export const Primary = Template.bind({});
Primary.args = {};
