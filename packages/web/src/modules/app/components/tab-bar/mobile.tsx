import React, { FunctionComponent } from 'react';
import { hooks, ui } from '@application';
import styled from '@emotion/styled';

const { Icon, Container } = ui;

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
  '&.active svg': {
    opacity: 1,
  },
  svg: {
    opacity: 0.4,
    marginBottom: '0.4em',
  },
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 30%',
  flexDirection: 'column',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 8,
  cursor: 'pointer',
  color: '#182235',
  textTransform: 'uppercase',
});

export default function TabBar() {
  return (
    <Container className="p-0 d-flex h-100 up-shadow" fluid>
      <TabButton path="/">
        <Icon type="home" textual />
        Dashboard
      </TabButton>
      <TabButton path="/lessons">
        <Icon type="chess" textual />
        Browse Lessons
      </TabButton>
      <TabButton path="/lesson/new">
        <Icon type="plus" textual />
        Create Lesson
      </TabButton>
      <TabButton path="/coaches">
        <Icon type="crown" textual />
        Find Coach
      </TabButton>
    </Container>
  );
}
