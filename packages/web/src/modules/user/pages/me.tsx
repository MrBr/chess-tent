import React from 'react';
import { hooks } from '@application';
import { Profile, ProfileEdit } from '../components/profile';

const { useActiveUserRecord, useLocation } = hooks;

export default () => {
  const location = useLocation();
  const edit = new URLSearchParams(location.search).get('edit');
  const { value: user } = useActiveUserRecord();

  return edit ? <ProfileEdit user={user} /> : <Profile user={user} editable />;
};
