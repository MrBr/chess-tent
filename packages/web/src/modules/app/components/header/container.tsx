import React, { ComponentType } from 'react';
import { ui } from '@application';

const { Container, Row } = ui;

const HeaderContainer: ComponentType = ({ children }) => {
  return (
    <Container fluid className="h-100">
      <Row className="h-100 align-items-center">{children}</Row>
    </Container>
  );
};

export default HeaderContainer;
