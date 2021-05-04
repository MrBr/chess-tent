import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, requests, services, socket } from '@application';

const {
  useApi,
  useDispatch,
  useActiveUserRecord,
  useComponentState,
  useMeta,
} = hooks;

const { addProvider } = services;

const Provider: ComponentType = ({ children }) => {
  const { mounted } = useComponentState();
  const { fetch, response, loading, reset } = useApi(requests.me);
  const dispatch = useDispatch();
  const [socketConnected] = useMeta('socketConnected');
  const [user, updateActiveUser] = useActiveUserRecord();
  const userId = user?.id;

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (socketConnected && userId) {
      socket.subscribe(`user-${userId}`);
    }
  }, [socketConnected, userId]);

  useEffect(() => {
    if (response) {
      updateActiveUser(response.data);
    }
    return;
  }, [dispatch, response, updateActiveUser]);

  useEffect(() => {
    if (user) {
      // Once logged in clear the state
      reset();
    }
  }, [user, response, reset]);

  if (!mounted || loading || (response && !user)) {
    return <>Loading</>;
  }

  return children as ReactElement;
};

addProvider(Provider);
