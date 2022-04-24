import React, { ComponentType } from 'react';
import { ui } from '@application';
import { Components } from '@types';

const { Container, Row } = ui;

const HeaderContainer: Components['Header'] = ({ children, className }) => {
  return (
    <Container fluid className={`${className} h-100`}>
      <Row className="h-100 align-items-center">{children}</Row>
    </Container>
  );
};

export default HeaderContainer;
