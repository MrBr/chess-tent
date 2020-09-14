import React, { ComponentProps } from 'react';
import { Components } from '@types';
import { ui } from '@application';
import Sidebar from './sidebar';

const { Container, Col, Row } = ui;

export default ({
  board,
  sidebar,
}: ComponentProps<Components['LessonPlayground']>) => (
  <Container fluid className="px-0 h-100">
    <Row noGutters className="h-100">
      <Col>{board}</Col>
      <Col xs={5} xl={4}>
        <Sidebar>{sidebar}</Sidebar>
      </Col>
    </Row>
  </Container>
);
