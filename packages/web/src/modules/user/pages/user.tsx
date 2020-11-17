import React, { useEffect } from 'react';
import { hooks, requests } from '@application';
import { Profile } from './profile';

const { useParams, useApi } = hooks;

export default () => {
  const { userId } = useParams();
  const { fetch, response, loading, error } = useApi(requests.user);
  useEffect(() => {
    if (response || loading || error) {
      return;
    }
    fetch(userId);
  }, [error, fetch, loading, response, userId]);

  return response?.data ? <Profile user={response?.data} /> : null;
};
