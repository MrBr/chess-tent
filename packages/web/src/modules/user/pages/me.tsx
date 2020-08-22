import React, { useEffect } from 'react';
import { hooks, requests } from '@application';

const { useApi } = hooks;

export default () => {
  const { fetch, loading, response } = useApi(requests.me);
  useEffect(() => {
    fetch();
  }, [fetch]);
  return <>{loading ? 'Loading' : JSON.stringify(response)}</>;
};
