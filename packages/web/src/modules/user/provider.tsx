import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, requests, services, socket } from '@application';

const { useApi, useDispatch, useActiveUserRecord, useComponentState } = hooks;

const { addProvider } = services;

const Provider: ComponentType = ({ children }) => {
  const { mounted } = useComponentState();
  const { fetch, response, loading, reset } = useApi(requests.me);
  const dispatch = useDispatch();
  const [user, updateActiveUser] = useActiveUserRecord();

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (response) {
      socket.subscribe(`user-${response.data.id}`);
      updateActiveUser(response.data);
    }
    return;
  }, [dispatch, response, updateActiveUser]);

  useEffect(() => {
    if (user) {
      // Once logged in clear the state
      reset();
    }
  }, [user, response]);

  if (!mounted || loading || (response && !user)) {
    return <>Loading</>;
  }

  return children as ReactElement;
};

addProvider(Provider);
