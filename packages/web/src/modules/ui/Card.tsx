import RBCard from 'react-bootstrap/Card';
import styled from '@emotion/styled';
import { ComponentType } from 'react';
import { ClickProps } from '@types';

const Card = styled<ComponentType<ClickProps>>(RBCard)({
  background: 'transparent',
  border: 0,
});

const CardBody = RBCard.Body;

export { Card, CardBody };
