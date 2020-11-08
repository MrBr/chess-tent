import React from 'react';
import { hooks } from '@application';
import { User } from '@chess-tent/models';
import { Profile, ProfileEdit } from './profile';

const { useActiveUserRecord, useLocation } = hooks;

export default () => {
  const location = useLocation();
  const edit = new URLSearchParams(location.search).get('edit');
  const [user] = useActiveUserRecord() as [User, never, never];

  return edit ? <ProfileEdit user={user} /> : <Profile user={user} />;
};
