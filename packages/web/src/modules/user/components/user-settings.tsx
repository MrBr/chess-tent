import React, { useEffect } from 'react';
import { components, hooks, requests, state, ui } from '@application';
import { Components } from '@types';

const { Dropdown } = ui;
const { useHistory, useActiveUserRecord, useApi, useDispatch } = hooks;
const { UserAvatar } = components;
const {
  actions: { resetState },
} = state;

const UserSettings: Components['UserSettings'] = ({ label }) => {
  const history = useHistory();
  const { value: user } = useActiveUserRecord();
  const dispatch = useDispatch();
  const { fetch: logout, response: logoutResponse } = useApi(requests.logout);

  useEffect(() => {
    if (logoutResponse) {
      dispatch(resetState());
    }
  }, [dispatch, logoutResponse]);

  if (!user) {
    return null;
  }

  return (
    <Dropdown>
      <Dropdown.Toggle id="header-user" collapse>
        <UserAvatar size="extra-small" user={user} />
        {label}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => history.push('/me')}>
          Profile
        </Dropdown.Item>
        {user.coach && (
          <Dropdown.Item onClick={() => history.push('/me/students')}>
            Students
          </Dropdown.Item>
        )}
        <Dropdown.Item onClick={() => history.push('/me/coaches')}>
          Coaches
        </Dropdown.Item>
        <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserSettings;
