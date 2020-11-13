import React, { useEffect } from 'react';
import { hooks, requests } from '@application';
import { User } from '@chess-tent/models';
import { Profile, ProfileEdit } from './profile';

const { useActiveUserRecord, useLocation, useParams, useApi } = hooks;

export default () => {
  const { userId } = useParams();
  const { fetch, response, loading, error } = useApi(requests.user);
  useEffect(() => {
    if (response || loading || error) {
      return;
    }
    fetch(userId);
  }, []);

  return response?.data ? <Profile user={response?.data} /> : null;
};
