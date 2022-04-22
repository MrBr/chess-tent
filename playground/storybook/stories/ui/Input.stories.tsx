import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Input',
} as ComponentMeta<UI['Input']>;

export const Default: ComponentStory<UI['Input']> = withWebNamespace(
  'ui',
  (args, { Input, FormGroup, Row, Container, Label, InputGroup, Icon }) => (
    <Container>
      <Row>
        <FormGroup>
          <Label>Empty</Label>
          <Input />
        </FormGroup>
      </Row>
      <Row>
        <FormGroup>
          <Label>Empty with placeholder</Label>
          <Input placeholder="Placeholder" />
        </FormGroup>
      </Row>
      <Row>
        <FormGroup>
          <Label>With value</Label>
          <Input value="Value" />
        </FormGroup>
      </Row>
      <Row>
        <FormGroup>
          <Label>Disabled</Label>
          <Input disabled placeholder="Placeholder" />
        </FormGroup>
      </Row>
      <Row>
        <FormGroup>
          <Label>With side extras</Label>
          <InputGroup>
            <InputGroup.Text>
              <Icon type="search" />
            </InputGroup.Text>
            <Input placeholder="Placeholder" />
            <InputGroup.Text>
              <Icon type="close" />
            </InputGroup.Text>
          </InputGroup>
        </FormGroup>
      </Row>
    </Container>
  ),
);

export const Size: ComponentStory<UI['Input']> = withWebNamespace(
  'ui',
  (args, { Input, FormGroup, Row, Container, Label }) => (
    <Container>
      <Row>
        <FormGroup>
          <Label>Small</Label>
          <Input placeholder="Placeholder" size="small" />
        </FormGroup>
      </Row>
      <Row>
        <FormGroup>
          <Label>Medium</Label>
          <Input placeholder="Placeholder" size="medium" />
        </FormGroup>
      </Row>
    </Container>
  ),
);
