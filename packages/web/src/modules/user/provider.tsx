import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, requests, services, socket } from '@application';

const { useApi, useDispatch, useActiveUserRecord } = hooks;

const { addProvider } = services;

const Provider: ComponentType = ({ children }) => {
  const { fetch, response, error } = useApi(requests.me);
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
  }, [dispatch, response, updateActiveUser]);

  if (!user && !error && !response) {
    return <>Loading</>;
  }

  return children as ReactElement;
};

addProvider(Provider);
