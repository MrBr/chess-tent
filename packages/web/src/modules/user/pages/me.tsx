import { hooks } from '@application';
import React from 'react';

import Profile from './profile';
import ProfileEdit from './edit';

const { useActiveUserRecord, useLocation } = hooks;

const PageMe = () => {
  const location = useLocation();
  const edit = new URLSearchParams(location.search).get('edit');
  const { value: user } = useActiveUserRecord();

  return edit ? <ProfileEdit user={user} /> : <Profile user={user} editable />;
};

export default PageMe;
