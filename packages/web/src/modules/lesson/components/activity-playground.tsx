import React, { ComponentProps } from 'react';
import { Components } from '@types';
import { ui } from '@application';

const { Container, Col, Row } = ui;

export default ({
  board,
  sidebar,
}: ComponentProps<Components['LessonPlayground']>) => (
  <Container fluid className="h-100">
    <Row className="h-100">
      <Col className="pt-5">{board}</Col>
      <Col xs={5} xl={4} className="h-100 overflow-y-auto pt-4">
        {sidebar}
      </Col>
    </Row>
  </Container>
);
