import React, { useEffect } from 'react';
import { hooks, requests } from '@application';
import { User } from '@chess-tent/models';
import { Profile } from './profile';

const { useParams, useApi, useRecord } = hooks;

export default () => {
  const { userId } = useParams();
  const [user, setUser] = useRecord<User>(`user-${userId}`);
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
