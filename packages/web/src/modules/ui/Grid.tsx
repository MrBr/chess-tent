import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from '@emotion/styled';

const Page = styled(props => <Container fluid {...props} />)({
  padding: '0 6.25em',
});

export { Container, Row, Col, Page };
