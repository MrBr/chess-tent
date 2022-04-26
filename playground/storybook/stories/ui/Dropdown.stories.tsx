import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Dropdown',
} as ComponentMeta<UI['Dropdown']>;

const Template: ComponentStory<UI['Dropdown']> = withWebNamespace(
  'ui',
  (args, { Dropdown }) => (
    <Dropdown>
      <Dropdown.Toggle id="exercises" className="mb-2">
        Toggle
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {['Option 1', 'Option 2'].map(option => (
          <Dropdown.Item key={option}>{option}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  ),
);

export const Default = Template.bind({});
Default.args = {};
