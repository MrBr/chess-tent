import React, { FunctionComponent } from 'react';
import { components, ui } from '@application';

const { Text, Col, Row } = ui;
const { Link } = components;

const RegistrationFooter: FunctionComponent = () => {
  return (
    <Row>
      <Col>
        <Text fontSize="extra-small" className="mt-4" align="center">
          Already a member? <Link to="/login">Sign in</Link>
        </Text>
        <Text
          className="mt-5"
          fontSize="extra-small"
          align="center"
          color="grey"
        >
          By signing up you agree to our Terms of Services and Privacy Policy
        </Text>
      </Col>
    </Row>
  );
};

export default RegistrationFooter;
