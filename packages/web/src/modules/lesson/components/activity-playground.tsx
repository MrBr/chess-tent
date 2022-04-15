import React, { ComponentProps } from 'react';
import { Components } from '@types';
import { ui } from '@application';

const { Container, Col, Row } = ui;

const ActivityPlayground = ({
  children,
}: ComponentProps<Components['LessonPlayground']>) => {
  return (
    <Container fluid className="h-100">
      <Row className="h-100">{children}</Row>
    </Container>
  );
};

ActivityPlayground.Board = (({ children }) => (
  <Col className="pt-5">{children}</Col>
)) as Components['LessonPlayground']['Board'];

ActivityPlayground.Sidebar = (({ children }) => (
  <Col md={5} xl={4} className="h-100 pr-5 pl-5">
    <Row className="h-100 d-flex flex-column flex-nowrap g-0">{children}</Row>
  </Col>
)) as Components['LessonPlayground']['Sidebar'];

ActivityPlayground.Stepper = (({ children }) => (
  <Col xl={1}>{children}</Col>
)) as Components['LessonPlayground']['Stepper'];

export default ActivityPlayground;
