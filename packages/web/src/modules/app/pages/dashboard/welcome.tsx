import React from 'react';
import { ui } from '@application';

const { Row, Col, Headline2, Text } = ui;

interface WelcomeProps {
  name: string;
  className?: string;
}

const Welcome = ({ name, className }: WelcomeProps) => (
  <Row className={`mt-4 ${className}`}>
    <Col>
      <Headline2>Hello, {name} 👋</Headline2>
      <Text>We hope you enjoy the platform. Let us know how you like it.</Text>
    </Col>
  </Row>
);

export default Welcome;
