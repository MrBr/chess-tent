import React from 'react';
import { ui, hooks } from '@application';

const { Container, Button } = ui;
const { useHistory } = hooks;

export default () => {
  const history = useHistory();
  return (
    <Container>
      <Button onClick={() => history.push('/lesson')}>Add new lesson</Button>
    </Container>
  );
};
