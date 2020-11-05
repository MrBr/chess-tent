import React from 'react';
import { ui } from '@application';
import { Components } from '@types';

const { Container, Row, Col } = ui;

export default (({ header, children }) => {
  return (
    <>
      <Container className="mb-2">
        <Row>
          <Col>{header}</Col>
        </Row>
      </Container>
      <Container className="mt-5">{children}</Container>
    </>
  );
}) as Components['LessonPlaygroundSidebar'];
