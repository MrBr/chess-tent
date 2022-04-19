import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Card',
} as ComponentMeta<UI['CardEmpty']>;

export const CardEmpty: ComponentStory<UI['CardEmpty']> = withWebNamespace(
  'ui',
  (args, { CardEmpty }) => <CardEmpty {...args} />,
);
CardEmpty.args = {
  title: 'Best way to start',
  subtitle: 'Browse the coaches',
  cta: 'Find a coach',
};

export const CardEmptyInList: ComponentStory<UI['CardEmpty']> =
  withWebNamespace('ui', (args, { CardEmpty, Row }) => (
    <Row className="g-0">
      <CardEmpty {...args} />
      <div
        style={{ height: 400, background: 'grey' }}
        className="ms-2 col-auto"
      >
        Test item with height
      </div>
    </Row>
  ));
CardEmptyInList.args = {
  title: 'Best way to start',
  subtitle: 'Browse the coaches',
  cta: 'Find a coach',
};
