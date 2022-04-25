import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Overlay',
} as ComponentMeta<UI['Overlay']>;

const Template: ComponentStory<UI['Overlay']> = withWebNamespace(
  'ui',
  (args, { OverlayTrigger, Tooltip, Icon }) => (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id="test">Search tooltip</Tooltip>}
    >
      <Icon type="search" />
    </OverlayTrigger>
  ),
);

export const Default = Template.bind({});
Default.args = {};
