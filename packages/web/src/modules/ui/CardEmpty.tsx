import React, { ComponentProps } from 'react';
import styled from '@chess-tent/styled-props';
import { UI } from '@types';

import Card from './Card';
import Icon from './Icon';
import { Text } from './Text';
import { Button } from './Button';
import Tag from './Tag';

/**
 * CardEmpty is designed in a way to inherit height
 */
const CardEmpty = styled<ComponentProps<UI['CardEmpty']>>(
  ({ className, title, subtitle, cta, onClick, icon }) => {
    return (
      <Card className={className}>
        <Card.Body>
          <Tag className="mb-3">
            <Icon type={icon} />
          </Tag>
          <Text className="mb-1" align="center" weight={500}>
            {title}
          </Text>
          <Text fontSize="extra-small" align="center">
            {subtitle}
          </Text>
          <Button
            variant="ghost"
            size="small"
            className="d-inline-block"
            onClick={onClick}
          >
            {cta}
          </Button>
        </Card.Body>
      </Card>
    );
  },
).css`
  align-items: center;
  width: 300px;
  
  .card-body {
    text-align: center;
    flex: 0;
    margin: auto;
  }
` as UI['CardEmpty'];

export default CardEmpty;
