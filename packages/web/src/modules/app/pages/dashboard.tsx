import React from 'react';
import { components, ui } from '@application';

const { Layout, Coaches } = components;
const { Row, Col } = ui;

export default () => (
  <Layout>
    <Row noGutters>
      <Col>
        <Coaches />
      </Col>
    </Row>
  </Layout>
);
