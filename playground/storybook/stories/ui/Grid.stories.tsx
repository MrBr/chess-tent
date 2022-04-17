import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Grid',
} as ComponentMeta<UI['Page']>;

export const Default: ComponentStory<UI['Page']> = withWebNamespace(
  'ui',
  (args, { Page, Row, Col, Headline4 }) => (
    <Page>
      <Headline4>12 column bootstrap grid</Headline4>
      <Row>
        {[...Array(12)].map((v, index) => (
          <Col>{index + 1}</Col>
        ))}
      </Row>
    </Page>
  ),
);

export const Horizontal: ComponentStory<UI['Page']> = withWebNamespace(
  'ui',
  (args, { Page, Row, Col }) => (
    <Page>
      <Row>
        <Col xs={2}>2</Col>
        <Col xs={6}>6</Col>
        <Col xs={4}>4</Col>
      </Row>
    </Page>
  ),
);

export const Vertical: ComponentStory<UI['Page']> = withWebNamespace(
  'ui',
  (args, { Page, Row, Col }) => (
    <Page className="h-100">
      <Row className="flex-column h-100">
        <Col>Cell 1</Col>
        <Col>Cell 2</Col>
      </Row>
    </Page>
  ),
);
