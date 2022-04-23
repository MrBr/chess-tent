import React, { ComponentType } from 'react';
import { ui } from '@application';

const { Container } = ui;

const TabBarContainer: ComponentType = ({ children }) => {
  return (
    <Container className="p-0 d-flex h-100 up-shadow" fluid>
      {children}
    </Container>
  );
};

export default TabBarContainer;
