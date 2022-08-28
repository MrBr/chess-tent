import React from 'react';
import { ui } from '@application';
import { Components } from '@types';

const { Container, Row } = ui;

const HeaderContainer: Components['Header'] = ({ children, className }) => {
  return (
    <Container fluid className={`${className} h-100 px-sm-5 px-xs-3`}>
      <Row className="h-100 align-items-center">{children}</Row>
    </Container>
  );
};

export default HeaderContainer;
