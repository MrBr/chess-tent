import React, { useEffect } from 'react';
import { hooks, requests } from '@application';
import { user as userRecord } from '../records';
import Profile from './profile';

const { useParams, useApi, useRecordInit } = hooks;

const PageUser = () => {
  const { userId } = useParams<{ userId: string }>();
  const { value: user, update: setUser } = useRecordInit(
    userRecord,
    `user-${userId}`,
  );
  const { fetch, response, loading, error } = useApi(requests.user);
  useEffect(() => {
    if (response && !error) {
      setUser(response.data);
    }
  }, [error, response, setUser]);
  useEffect(() => {
    if (response || loading || error) {
      return;
    }
    fetch(userId);
  }, [error, fetch, loading, response, userId]);

  return user ? <Profile user={user} /> : null;
};

export default PageUser;
