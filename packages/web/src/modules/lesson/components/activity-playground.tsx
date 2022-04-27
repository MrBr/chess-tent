import React, { ComponentProps } from 'react';
import { Components } from '@types';
import { ui } from '@application';
import { css } from '@chess-tent/styled-props';

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
  <Col className="col-12 col-md-auto flex-md-fill pt-5">{children}</Col>
)) as Components['LessonPlayground']['Board'];

ActivityPlayground.Sidebar = (({ children }) => (
  <Col className="col-auto col-md-5 col-xl-4 h-100 pr-5 pl-5">
    <Row className="h-100 d-flex flex-column flex-nowrap g-0">{children}</Row>
  </Col>
)) as Components['LessonPlayground']['Sidebar'];

const { className: stepperClassName } = css`
  :empty {
    display: none;
  }
  flex: 0;
  flex-basis: 150px;
  height: 100%;
  border-left: 1px solid var(--grey-400-color);
  padding: 0;
`;
ActivityPlayground.Stepper = (({ children }) => (
  <div className={stepperClassName}>{children}</div>
)) as Components['LessonPlayground']['Stepper'];

export default ActivityPlayground;
