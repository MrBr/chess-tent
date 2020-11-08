import RBCard from 'react-bootstrap/Card';
import styled from '@emotion/styled';
import { ComponentProps, ComponentType } from 'react';
import { ClickProps, UI } from '@types';

const CardComponent = styled<
  ComponentType<ComponentProps<RBCard> & ClickProps>
>(RBCard)({
  background: 'transparent',
  border: 0,
}) as UI['Card'];

const CardBody = RBCard.Body;

export { CardComponent, CardBody };
