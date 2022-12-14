import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';
import * as icons from '@chess-tent/web/src/modules/ui/Icon/iconMap';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Icon',
} as ComponentMeta<UI['Icon']>;

const Template: ComponentStory<UI['Icon']> = withWebNamespace(
  'ui',
  (args, { Icon }) => <Icon {...args} />,
);

export const Default = Template.bind({});
Default.args = { type: 'board' };

export const Primary = Template.bind({});
Primary.args = { type: 'comment', variant: 'primary' };

export const All: ComponentStory<UI['Icon']> = withWebNamespace(
  'ui',
  (args, { Text, Badge, Icon, Container, Row, Col }) => (
    <Container>
      <Row className="g-2">
        {Object.keys(icons).map((type: any) => (
          <Col className="col-auto">
            <Badge>
              <Icon type={type} />
            </Badge>
            <Text>{type}</Text>
          </Col>
        ))}
      </Row>
    </Container>
  ),
);
