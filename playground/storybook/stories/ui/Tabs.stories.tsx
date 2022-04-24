import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Tabs',
} as ComponentMeta<UI['Tabs']>;

export const Uncontrolled: ComponentStory<UI['Tabs']> = withWebNamespace(
  'ui',
  (args, { Tabs, Tab }) => (
    <Tabs defaultActiveKey="First">
      <Tab eventKey="First" title="First">
        First
      </Tab>
      <Tab eventKey="Second" title="Second">
        Second
      </Tab>
      <Tab eventKey="Third" title="Third">
        Third
      </Tab>
    </Tabs>
  ),
);

export const Controlled: ComponentStory<UI['Tabs']> = withWebNamespace(
  'ui',
  (args, { Tabs, Tab }) => (
    <Tabs activeKey="First">
      <Tab title="First">First</Tab>
      <Tab title="Second">Second</Tab>
      <Tab title="Third">Third</Tab>
    </Tabs>
  ),
);
