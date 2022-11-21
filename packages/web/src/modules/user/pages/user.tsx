import React, { useEffect } from 'react';
import { hooks } from '@application';
import { user as userRecord } from '../records';
import Profile from './profile';

const { useParams, useRecordInit } = hooks;

const PageUser = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    value: user,
    load,
    meta: { loading },
  } = useRecordInit(userRecord, `user-${userId}`);
  useEffect(() => {
    if (loading || !userId || user) {
      return;
    }
    load(userId);
  }, [loading, userId, user, load]);

  return user ? <Profile user={user} /> : null;
};

export default PageUser;
