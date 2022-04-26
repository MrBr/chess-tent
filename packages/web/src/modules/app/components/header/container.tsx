import React from 'react';
import { ui } from '@application';
import { Components } from '@types';

const { Container, Row } = ui;

const HeaderContainer: Components['Header'] = ({ children, className }) => {
  return (
    <Container fluid className={`${className} h-100 ps-5 pe-5`}>
      <Row className="h-100 align-items-center">{children}</Row>
    </Container>
  );
};

export default HeaderContainer;
