import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Page, Row, Col } from '@chess-tent/web/src/modules/ui/Grid';

export default {
  title: 'UI/Grid',
  component: Page,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Page>;

export const Default: ComponentStory<typeof Page> = args => (
  <Page>
    <Row>
      {Array(12).map((v, index) => (
        <Col>{index}</Col>
      ))}
    </Row>
  </Page>
);

export const Horizontal: ComponentStory<typeof Page> = args => (
  <Page>
    <Row>
      <Col xs={2}>2</Col>
      <Col xs={6}>6</Col>
      <Col xs={4}>4</Col>
    </Row>
  </Page>
);

export const Vertical: ComponentStory<typeof Page> = args => (
  <Page className="h-100">
    <Row className="flex-column h-100">
      <Col>Cell 1</Col>
      <Col>Cell 2</Col>
    </Row>
  </Page>
);
