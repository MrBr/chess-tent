import React, { useEffect } from 'react';
import { components, hooks, requests, ui } from '@application';

const { Dropdown, Text } = ui;
const { useHistory, useActiveUserRecord, useApi } = hooks;
const { UserAvatar } = components;

export default () => {
  const history = useHistory();
  const [user, , clear] = useActiveUserRecord();
  const { fetch: logout, response: logoutResponse } = useApi(requests.logout);

  useEffect(() => {
    if (logoutResponse) {
      clear();
    }
  }, [clear, logoutResponse]);

  if (!user) {
    return null;
  }

  return (
    <Dropdown>
      <Dropdown.Toggle id="header-user" collapse>
        <UserAvatar size="small" user={user} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item>
          <Text onClick={() => history.push('/me')}>Profile</Text>
        </Dropdown.Item>
        {user.coach && (
          <Dropdown.Item>
            <Text onClick={() => history.push('/me/students')}>Students</Text>
          </Dropdown.Item>
        )}
        <Dropdown.Item>
          <Text onClick={() => history.push('/me/coaches')}>Coaches</Text>
        </Dropdown.Item>
        <Dropdown.Item>
          <Text onClick={logout}>Logout</Text>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
