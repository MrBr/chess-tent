import React from 'react';
import { components } from '@application';

const { EditBoardToggle } = components;

interface FooterProps {
  updateEditing: (editing: boolean) => void;
  editing: boolean;
}
export default ({ updateEditing, editing }: FooterProps) => (
  <>
    <EditBoardToggle editing={editing} onChange={updateEditing} />
  </>
);
