import RBCard from 'react-bootstrap/Card';
import styled from '@emotion/styled';
import { ComponentProps, ComponentType } from 'react';
import { ClickProps, UI } from '@types';

const CardComponent = styled<
  ComponentType<ComponentProps<RBCard> & ClickProps>
>(RBCard)({
  border: 0,
  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
}) as UI['Card'];

const CardBody = RBCard.Body;
const CardHeader = RBCard.Header;

export { CardComponent, CardBody, CardHeader };
