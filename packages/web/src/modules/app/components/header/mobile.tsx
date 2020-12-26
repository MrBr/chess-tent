import React, { useEffect } from 'react';
import { components, hooks, requests, ui } from '@application';
import { User } from '@chess-tent/models';
import { Components } from '@types';

const { Container, Headline4, Row, Col, Dropdown, Text } = ui;
const { useHistory, useApi, useActiveUserRecord } = hooks;
const { UserAvatar, NotificationStand } = components;

const Header: Components['Header'] = () => {
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
          xs={6}
        >
          <Headline4 className="m-0">CHESS TENT</Headline4>
        </Col>
        <Col className="d-flex justify-content-end" xs={6}>
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
