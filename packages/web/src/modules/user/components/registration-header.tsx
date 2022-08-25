import React, { FunctionComponent } from 'react';
import { ui } from '@application';

const { Headline4, Text, Col, Row } = ui;

const RegistrationHeader: FunctionComponent<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => {
  return (
    <Row>
      <Col>
        <Headline4 className="mt-4 mb-1">{title}</Headline4>
        <Text fontSize="extra-small">{subtitle}</Text>
      </Col>
    </Row>
  );
};

export default RegistrationHeader;
