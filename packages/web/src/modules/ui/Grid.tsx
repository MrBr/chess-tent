import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from '@emotion/styled';
import { UIComponent } from '@types';

const Page = styled<UIComponent>(props => <Container fluid {...props} />)``;

export { Container, Row, Col, Page };
