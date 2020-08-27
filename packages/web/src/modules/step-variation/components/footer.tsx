import React from 'react';
import { ui } from '@application';

const { Check, Container } = ui;
interface FooterProps {
  toggleEditingMode: () => void;
  editing: boolean;
}
export default ({ toggleEditingMode, editing }: FooterProps) => (
  <Container>
    Edit <Check onChange={toggleEditingMode} checked={!!editing} />
  </Container>
);
