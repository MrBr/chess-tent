import React, { ComponentProps } from 'react';
import { Components } from '@types';
import { ui } from '@application';

const { Container, Col, Row } = ui;

const ActivityPlayground = ({
  stepper,
  board,
  sidebar,
}: ComponentProps<Components['LessonPlayground']>) => {
  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col className="pt-5">{board}</Col>
        <Col md={5} xl={4} className="h-100 pr-5 pl-5">
          <Row className="h-100 d-flex flex-column flex-nowrap" noGutters>
            {sidebar}
          </Row>
        </Col>
        <Col xl={1}>{stepper}</Col>
      </Row>
    </Container>
  );
};

export default ActivityPlayground;
