import React, { FunctionComponent, useEffect } from 'react';
import { ui, hooks, requests, components } from '@application';
import styled from '@emotion/styled';
import { User } from '@chess-tent/models';
import { Components } from '@types';

const { Container, Headline4, Row, Col, Dropdown, Text, SearchBox } = ui;
const { useHistory, useApi, useActiveUserRecord } = hooks;
const { UserAvatar, NotificationStand } = components;
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
  display: 'inline-block',
  lineHeight: '96px',
  fontWeight: 700,
  fontSize: 18,
  marginRight: 48,
  cursor: 'pointer',
});

const Header: Components['Header'] = ({ onSearch }) => {
  const history = useHistory();
  const logoutApi = useApi(requests.logout);
  const [, , clear] = useActiveUserRecord();
  useEffect(() => {
    if (logoutApi.response) {
      clear();
    }
  }, [clear, logoutApi]);
  const [user] = useActiveUserRecord() as [User, never, never];
  return (
    <Container fluid className="h-100">
      <Row className="h-100 align-items-center">
        <Col
          className="col-auto cursor-pointer"
          onClick={() => history.push('/')}
          xs={3}
        >
          <Headline4 className="m-0">CHESS TENT</Headline4>
        </Col>
        <Col className="h-100" xs={6}>
          <TabButton path="/">Dashboard</TabButton>
          <TabButton path="/lesson/new">Create Lesson</TabButton>
          <TabButton path="/coach">Find Coach</TabButton>
        </Col>
        <Col className="align-items-center" xs={2}>
          {onSearch && <SearchBox onSearch={onSearch} debounce={500} />}
        </Col>
        <Col className="d-flex justify-content-end" xs={1}>
          <NotificationStand />
          <Dropdown>
            <Dropdown.Toggle id="header-user">
              <UserAvatar size="small" user={user} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Text onClick={() => history.push('/me')}>Profile</Text>
              </Dropdown.Item>
              {user.coach && (
                <Dropdown.Item>
                  <Text onClick={() => history.push('/me/students')}>
                    Students
                  </Text>
                </Dropdown.Item>
              )}
              <Dropdown.Item>
                <Text onClick={() => history.push('/me/coaches')}>Coaches</Text>
              </Dropdown.Item>
              <Dropdown.Item>
                <Text onClick={() => logoutApi.fetch()}>Logout</Text>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
