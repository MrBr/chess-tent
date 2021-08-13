import React, { FunctionComponent } from 'react';
import { hooks } from '@application';
import styled from '@emotion/styled';

const { useHistory } = hooks;

const TabButton = styled<
  FunctionComponent<{ path: string; className?: string }>
>(({ className, path, children }) => {
  const history = useHistory();
  const active = history.location.pathname === path;
  return (
    <div
      className={`${className} ${active ? 'active' : ''}`}
      onClick={() => history.push(path)}
    >
      {children}
    </div>
  );
})({
  '&.active': {
    borderBottom: '2px solid red',
  },
  '&:last-child': {
    marginRight: 0,
  },
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700,
  fontSize: 18,
  marginRight: 48,
  cursor: 'pointer',
});

export default function TabBar() {
  return (
    <>
      <TabButton path="/">Dashboard</TabButton>
      <TabButton path="/coaches">Coaches</TabButton>
      <TabButton path="/lesson/new">Create</TabButton>
      <TabButton path="/lessons">Lessons</TabButton>
    </>
  );
}
